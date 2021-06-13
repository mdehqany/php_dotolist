<?php
function mySort($a, $b) {
    if($a['pri'] == $b['pri']) {
        return 0;
    }
    return ($a['pri'] < $b['pri']) ? -1 : 1;
}

$task = $_GET['task'];
if(!preg_match("#[^a-z]#",$task)){
    if($task == "tasks"){
        if(file_exists("datas.json")){
            echo file_get_contents("datas.json"); die();
        }else {
            echo json_encode(array());
            die();
        }
    }
    if($task == "addtask"){
        $title = $_POST['title'];
        $priority = $_POST['pri'];
        //You can Add Any Charecter You Want In This Regex
        if(!preg_match("#[^a-zA-Z0-9 \(\)]#",$title) && !preg_match("#[^0-9]#",$priority)){
            if(!file_exists("datas.json")){ file_put_contents("datas.json","[]"); }
            $datas = json_decode(file_get_contents("datas.json"),true);
            if(!isset($datas['queue'])){ $datas['queue'] = array(); }
            $datas['queue'][] = array("title"=>$title,"pri"=>$priority,"hash"=>md5($title.$priority.time()));
            uasort($datas['queue'], 'mySort');
            $data = array();
            foreach($datas['queue'] as $que){
                $data[] = $que;
            }
            $datas['queue'] = $data;
            file_put_contents("datas.json",json_encode($datas));
        }
    }
    if($task == "complete"){
        $hash = $_POST['hash'];
        $datas = json_decode(file_get_contents("datas.json"),true);
        $find = false;
        foreach($datas['queue'] as $key=>$que){
            if($que['hash'] == $hash){
                $find = $que;
                unset($datas['queue'][$key]);
                break;
            }
        }
        if($find){
            $datas['tasks'][] = $find;
        }
        file_put_contents("datas.json",json_encode($datas));
    }
    if($task == "delete"){
        $hash = $_POST['hash'];
        $datas = json_decode(file_get_contents("datas.json"),true);
        foreach($datas['tasks'] as $key=>$que){
            if($que['hash'] == $hash){
                unset($datas['tasks'][$key]);
            }
        }
        file_put_contents("datas.json",json_encode($datas));
    }
}
?>