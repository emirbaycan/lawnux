<?php

class Sql
{
    public function connect()
    {
        $mysqli = new mysqli('localhost', 'x', 'x', 'dev');
        mysqli_set_charset($mysqli, "utf8");
        return $mysqli;
    }
    public function close($mysqli)
    {
        $mysqli->close();
    }
    private function parses($a)
    {
        $b = '';
        for ($i=0;$i<$a;$i++) {
            $b.='s';
        }
        return $b;
    }
     
    private function parseq($a)
    {
        $b = [];
        for ($i=0;$i<$a;$i++) {
            $b[]='?';
        }
        return implode(',', $b);
    }
    public function get(
        $mysqli,
        $sql,
        $params = null,
        $counter = null,
        $counter_params = null
    )
    {
        $results = (object) [];
        if ($params) {
            $b = count($params);
        } else {
            $b = false;
        }
 
        $a = $mysqli->prepare($sql);
        if ($b) {
            $a->bind_param($this->parses($b), ...$params);
        }
        if (!$a || !$a->execute()) {
            $results->data = [];
            $results->result = 0;
            return $results;
        }
        
        $b = $a->get_result();
        $d = [];
        while ($c = $b->fetch_assoc()) {
            $d[] = $c;
        }
        
        $results->data = $d;
        if ($counter) {
            if ($counter_params) {
                $a = $mysqli->prepare($counter);
                $a->bind_param($this->parses(count($counter_params)), ...$counter_params);
                if (!$a->execute()) {
                    $results->result = 0;
                    return $results;
                }
                $a = $a->get_result();
            } else {
                $a = $mysqli->query($counter);
            }
            
            if ($b = $a->fetch_assoc()) {
                $a = $b['count'];
            } else {
                $a = 0;
            }
            $results->count = $a;
        }
        $results->result = 1;
        return $results;
    }
    public function query($mysqli, $sql, $params = null)
    {
        $results = (object) [];
 
        if (isset($params)) {
            $b = count($params);
        } else {
            $b = false;
        }
 
        $a = $mysqli->prepare($sql);
        if ($b) {
            $a->bind_param($this->parses($b), ...$params);
        }
        if ($a && !$a->execute()) {
            $results->result = 0;
            return $results;
        }
        $results->result = 1;
        return $results;
    }
    public function insert($mysqli, $table, $keys, $values)
    {
        $results = (object) [];
 
        if (!isset($table) || !isset($keys) || !isset($values)) {
            $results->result = 0;
            return $results;
        }
        $c = count($keys);
        if ($c != count($values)) {
            $results->result = 0;
            return $results;
        }
        $keys = implode(',', $keys);
        $sql = 'INSERT INTO '.$table.' ('.$keys.') VALUES ('.$this->parseq($c).')';
        $results->log = [$sql,$this->parses($c),$values];
 
        $a = $mysqli->prepare($sql);
        if ($c) {
            $a->bind_param($this->parses($c), ...$values);
        }
        if (!$a->execute()) {
            $results->result = 0;
            return $results;
        }
        $results->id = $a->insert_id;
        $results->result = 1;
        return $results;
    }
    public function insert_query($mysqli, $sql, $params)
    {
        $results = (object) [];
 
        if (isset($params)) {
            $b = count($params);
        } else {
            $b = false;
        }
 
        $a = $mysqli->prepare($sql);
        if ($b) {
            $a->bind_param($this->parses($b), ...$params);
        }
        if (!$a->execute()) {
            $results->result = 0;
            return $results;
        }
        $results->id = $a->insert_id;
        $results->result = 1;
        return $results;
    }
    public function update($mysqli, $table, $keys, $values, $where)
    {
        $results = (object) [];
 
        if (isset($values)) {
            $b = count($values);
        } else {
            $b = false;
        }
        $m = [];
        foreach ($keys as $a) {
            $m[]=$a.'=?';
        }
        $m = implode(',', $m);
        $m = 'UPDATE '.$table.' SET '.$m.' WHERE '.$where;
        $a = $mysqli->prepare($m);
        if ($b) {
            $a->bind_param($this->parses($b), ...$values);
        }
        if (!$a->execute()) {
            $results->result = 0;
            return $results;
        }
        $results->result = 1;
        return $results;
    }
    public function count($mysqli, $counter, $counter_params = null)
    {
        $results = (object) [];
   
        if (!isset($counter)) {
            $results->result = 0;
            return $results;
        }
         
        if (isset($counter_params)) {
            $a = $mysqli->prepare($counter);
            $a->bind_param($this->parses(count($counter_params)), ...$counter_params);
            if (!$a->execute()) {
                $results->result = 0;
                return $results;
            }
            $a = $a->get_result();
        } else {
            $a = $mysqli->query($counter);
        }
            
        if ($b = $a->fetch_assoc()) {
            $b = $b['count'];
        } else {
            $b = 0;
        }
        $results->count = $b;
        $results->result = 1;
        return $results;
    }
    public function delete($mysqli, $table, $where, $params)
    {
        $results = (object) [];
 
        if (isset($params)) {
            $b = count($params);
        } else {
            $b = false;
        }
        $m = 'DELETE FROM '.$table.' WHERE '.$where;
        $a = $mysqli->prepare($m);
        if ($b) {
            $a->bind_param($this->parses($b), ...$params);
        }
        if (!$a->execute()) {
            $results->result = 0;
            return $results;
        }
        $results->result = 1;
        return $results;
    }
    public function saveText($text)
    {
        $text = str_replace("&", '&amp;', $text);
        $text = str_replace("'", '&apos;', $text);
        $text = str_replace('"', '&quot;', $text);
        $text = str_replace(">", '&gt;', $text);
        $text = str_replace("<", '&lt;', $text);
        return $text;
    }
    public function pageText($page)
    {
        $page = str_replace('İ','i',$page);
        $page = mb_strtolower($page,'UTF-8');
        $page = preg_replace('/&/',' ',$page);
        $page = preg_replace('/  /',' ',$page);
        $page = preg_replace('/  /',' ',$page);
        $page = preg_replace('/  /',' ',$page);
        $page = preg_replace('/ /','-',$page);
        $page = preg_replace('/[.]/','',$page);
        $page = preg_replace('/ü/','u',$page);
        $page = preg_replace('/ğ/','g',$page);
        $page = preg_replace('/ş/','s',$page);
        $page = preg_replace('/ı/','i',$page);
        $page = preg_replace('/ö/','o',$page);
        $page = preg_replace('/ç/','c',$page);
        return $page;
    }
}
