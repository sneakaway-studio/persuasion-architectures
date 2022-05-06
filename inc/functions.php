<?php


$site_root = "https://sneakaway.studio/persuasion-architectures/";
$file_root = "";
$page_title = "";

// tests

// print "<pre>";
// print_r($_SERVER);
// print "</pre>";
// printConfig();

configInit();

// printConfig();





/**
 *	Return all or one json item
 */
function returnJsonData($key = "")
{
    $papers = json_decode(file_get_contents($file_root."data.json"), true);

    if ($key != "" && is_array($papers[$key])) {
        return $papers[$key];
    } else {
        return $papers;
    }
}
// tests

// $papers = returnJsonData();
// // print_r($papers);
//
// $paper = returnJsonData("gerig");
// print_r($paper);
//
// foreach($papers as $key => $value){
// 	print($key."<br>");
// }



/**
 *	Return true if running on localhost
 */
function isLocalhost($address = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $address) || $_SERVER['HTTP_HOST'] == 'localhost';
}

/**
 *	Set global vars based on environment
 */
function configInit()
{
    global $site_root;
    global $file_root;
    global $subdirectory;

    if (isLocalhost()) {
        $site_root = "http://localhost/_teaching/_code_web/persuasion-architectures";
    }
    if ($subdirectory) {
        $file_root = "../../";
    }
}

/**
 *	Return true if running on localhost
 */
function printConfig()
{
    global $site_root;
    global $file_root;
    global $page_title;

    print "<pre>";
    print('$site_root = '. $site_root . "<br>");
    print('$file_root = '. $file_root . "<br>");
    print('$page_title = '. $page_title . "<br>");
    print "</pre>";
}


/**
 *	Return true if running on localhost
 */
function printFileRoot()
{
    global $file_root;

    print($file_root);
}
