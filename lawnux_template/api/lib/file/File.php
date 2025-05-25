<?php

class File
{
    public function upload(
        $file,
        $target_dir,
        $filename,
        $max_size = null,
        $supported_formats = null
    ) {
        $results = (object)[];

        $base_path = getcwd();
        $base_path = substr($base_path, 0, strpos($base_path, 'api'));

        $target_dir = $base_path.$target_dir;
        $target_file = $target_dir.basename($file['name']);

        $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        if (isset($max_size) && $file['size'] > $max_size) {
            $results->result = -3;
            return $results;
        }

        if (isset($supported_formats)) {
            $m = false;
            foreach ($supported_formats as $m2) {
                if ($m2 == $file_type) {
                    $m = true;
                }
            }
            if (!$m) {
                $results->result = -2;
                return $results;
            }
        }

        move_uploaded_file($file['tmp_name'], $target_dir.$filename.'.'.$file_type);

        $results->file_type = $file_type;
        $results->result=1;
        return $results;
    }

    public function move(
        $user_id, $file_dir, 
        $target_dir, $filename)
    {
        $results = (object)[];
         
        $base_path = getcwd();
        $base_path = substr($base_path, 0, strpos($base_path, 'api'));
         
        $m = glob($base_path.$file_dir.$user_id.'.*');
        if (!count($m)) {
            $results->result = -1;
            return $results;
        }

        $file_path = $m[0];
        $old_filename = end(explode('/', $file_path));
        $file_type = end(explode('.', $old_filename));

        $new_path = $target_dir.$filename.'.'.$file_type;
        $target_path = $base_path.$new_path;

        if (!rename($file_path, $target_path)) {
            $results->result = -2;
            return $results;
        }

        $results->file_type = $file_type;
        $results->filepath = $new_path;
        $results->result = 1;
        return $results;
    }
}
