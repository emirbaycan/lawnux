<?php

class Kalenux
{
    private $api_key = '123456';
    private function parse_data($a)
    {
        $r=[];
        foreach ($a as $b => $c) {
            $r[] = $b.'='.$c;
        }
        $r[] = 'api_key='.$this->api_key;
        $r[] = 'time='.time();
        return implode('&', $r);
    }

    public function setDay($date)
    {
        if(!$date){
            return '';
        }
        $date = explode('-',explode(' ',$date)[0]);
        return $date[2];
    }

    public function setMonth($date)
    { 
        if(!$date){
            return '';
        }
        $months = [
            "01" => "OCAK",
            "02" => "ŞUBAT",
            "03" => "MART",
            "04" => "NİSAN",
            "05" => "MAYIS",
            "06" => "HAZİRAN",
            "07" => "TEMMUZ",
            "08" => "AĞUSTOS",
            "09" => "EYLÜL",
            "10" => "EKİM",
            "11" => "KASIM",
            "12" => "ARALIK"
        ];
        $date = explode('-',explode(' ',$date)[0]);
        $date = $date[1];
        return $months[$date];
    }

    public function get_template($template, $data)
    {
        $results = (object)[];

        $m = $this->parse_data($data);
        $m = 'http://dev.emirbaycan.com.tr/'.$template.'.php?'.$m;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $m);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        $file_text = curl_exec($curl);        
        $results->text = $file_text;
        
        curl_close($curl);
        $results->result=1;
        
        return $results;
    }
    private function set_get_template_file($sql,$mysqli,$language,$template_name){
        $file_path = $_SERVER['DOCUMENT_ROOT'].'/template/'.$template_name.'.html';
        $file = fopen($file_path,'r');

        $templater = fread($file,filesize($file_path)); 

        fclose($file);

        $data = $sql->get($mysqli,'SELECT * FROM '.$template_name.' WHERE visibility=1 ORDER BY created_at DESC');
        $data = $data->data;

        $content = '';
        foreach($data as $item){
            $content .= $this->setTemplate($templater,$item);
        }

        return $content;
    }    
    private function get_page_content($language,$path){
        $file_path = $_SERVER['DOCUMENT_ROOT'].'/'.$path.'.html';
        $file = fopen($file_path,'r');
        $file_content = fread($file,filesize($file_path));
        fclose($file);
        return $file_content;
    }    
    private function update_page_content($language,$page,$page_content){
        $file_path = $_SERVER['DOCUMENT_ROOT'].'/'.$page.'.html';
        $file = fopen($file_path,'w');
        fwrite($file,$page_content);
        fclose($file);
        chmod($file_path, 0766);
        return;
    }
    private function setTemplate($a, $b) {
        $c = [];
        $d = [];
        $e = [];
        $f = [];
        $g = [];
        $h = [];
        $j = [];
        preg_match_all('/£[\w_,]+£/', $a, $c);
        foreach ($c[0] as $f) {
            $d = str_replace('£', '', $f);
            $d = explode(',', $d);
            foreach ($d as $e) {
                $e = $b[$e];
                if ($e) {
                    $e = json_decode($e, true);
                    foreach ($e as $g => $h) {
                        $b[$g] = $h;
                    }
                }
            }
            $a = str_replace($f, '', $a);
        }
        preg_match_all('/\+[\w\._:,=;*]+\+/', $a, $c);
        foreach ($c[0] as $f) {
            $d = str_replace('+', '', $f);
            if (strpos($d, '=') !== false) {
                $d = explode('=', $d);
                $j = $d[0];
                $d = $d[1];
            } else {
                $j = false;
            }
            if (strpos($d, '.') !== false) {
                $d = explode('.', $d);
                $g = explode(',', $d[0]);
                if ($g[0] === '*') {
                    $e = json_encode($b);
                } else {
                    $e = [];
                    foreach ($g as $h) {
                        $h = $b[$h];
                        if (!$h && $h !== '0' && $h !== 0) {
                            continue;
                        }
                        $e[] = '"' . $h . '"';
                    }
                    $e = implode(',', $e);

                }
                if (!$e && $e !== '0' && $e !== 0) {
                    $e = '';
                } else {
                    $e = eval('return $this->' . $d[1] . '(' . $e . ');');
                }
            } else if (strpos($d, ':') !== false) {
                $d = explode(':', $d);
                $e = eval($d[1]);
                if ($e) {
                    $e = $e[$b[$d[0]]];
                } else {
                    $e = '';
                }
            } else if (strpos($d, ';') !== false) {
                $d = explode(';', $d);
                $e = $b[$d[0]];
                if ($e && $d[1]) {
                    $e = $e[$d[1]];
                } else {
                    $e = '';
                }
            } else {
                if ($b[$d] || ($e === '0' || $e === 0)) {
                    $e = $b[$d];
                } else {
                    $e = '';
                }
            }
            if ($j) {
                $b[$j] = $e;
                continue;
            }
            
            $a = str_replace($f, $e, $a);
        }
        
        $a = preg_replace('/#[£ \w\+=,;:\._]+#/', '', $a);
        return $a;
    }
    public function update_all_pages(){
        require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
        $sql = new Sql();
        $mysqli = $sql->connect();
        $data = $sql->get($mysqli,'SELECT * FROM pages');  
        $data = $data->data;
        foreach($data as $item){
            $this->update_page($sql,$mysqli,$item['page']);
        }
    }
    public function update_page($sql,$mysqli,$page){
        $data = $sql->get($mysqli,'SELECT * FROM pages WHERE page=?',[$page]);  
        $data = $data->data[0];
 
        $old_templates = $data['templates'];
        
        $localizeds = json_decode($data['localizeds']);
        
        $data = $sql->get($mysqli,'SELECT * FROM page_languages');  
        $data = $data->data;

        $languages = array();
        foreach($data as $item){
            $languages[] = $item['language']; 
        }

        $old_templates = explode(',',$old_templates);
        $templates = array();
        
        foreach($old_templates as $template){
            foreach($languages as $language){

                if(!$templates[$language]){
                    $templates[$language] = array();
                }
                if($templates[$language][$template]){
                    continue;
                }
                $templates[$language][$template] = $this->set_get_template_file($sql,$mysqli,$language,$template);
            }
        }



        $done_pages = [];

        foreach($localizeds as $language => $page){
            if(array_search($page,$done_pages)){
                continue;
            }
            $page_content = $this->get_page_content($language,$page);
            $templaters = $templates[$language];

            foreach($templaters as $template => $templater){

                $seperation_start = sprintf("/<%s[ \w_\"=]*>/",$template);
                $seperation_end = '</'.$template.'>';
                $page_contents = explode($seperation_end,$page_content);
                $repetation = count($page_contents)-1;

                for($i=0; $i<$repetation; $i++){
                    $mem = $page_contents[$i];
                    $matches = array();
                    if(!preg_match($seperation_start,$mem,$matches)){
                        continue;
                    }
                    $joiner = $matches[0];
                    $mem = preg_split($seperation_start,$mem);
                    $mem[1] = '';
                    $mem = implode($joiner,$mem);
                    $page_contents[$i] = $mem.$templater; 
                }

                $page_content = implode($seperation_end,$page_contents);

            }

            $this->update_page_content($language,$page,$page_content);

            $done_pages[] = $page;
        }

    }    
}
