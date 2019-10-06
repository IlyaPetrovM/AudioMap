<!DOCTYPE html>
<html>
<header>
<link rel='stylesheet' href='style/upload.css' />
</header>
<body>

<?php
function translit($s) {
  $s = (string) $s; // преобразуем в строковое значение
  $s = strip_tags($s); // убираем HTML-теги
  $s = str_replace(array("\n", "\r"), " ", $s); // убираем перевод каретки
  $s = preg_replace("/\s+/", ' ', $s); // удаляем повторяющие пробелы
  $s = trim($s); // убираем пробелы в начале и конце строки
  $s = function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s); // переводим строку в нижний регистр (иногда надо задать локаль)
  $s = strtr($s, array('а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'j','з'=>'z','и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'shch','ы'=>'y','э'=>'e','ю'=>'yu','я'=>'ya','ъ'=>'','ь'=>''));
  $s = preg_replace("/[^.-9a-z-_ ]/i", "", $s); // очищаем строку от недопустимых символов
  $s = str_replace(" ", "-", $s); // заменяем пробелы знаком минус
  return $s; // возвращаем результат
}

/// ------
/// Начало
/// ------

$password = "Ch0"."pyn"."45";
$target_dir = "media/";
$target_file = $target_dir . translit(basename($_FILES["songFile"]["name"]));
$uploadOk = 1;

$fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// if($fileType != "mp3"){
	// echo "! Можно загружать только mp3 файлы. <br>";
	// $uploadOk = 0;
// }
echo "<p id='error'>";
if ($_FILES["songFile"]["size"] > 20*1024*1024) {
    echo "! Размер файла больше 20 МБайт, попробуйте сжать его и повторите загрузку. <br>";
    $uploadOk = 0;
}
if ($_POST["psw"] != $password){
	echo "! Неправильный пароль <br>";
	$uploadOk = 0;
}
echo "</p>";
if($uploadOk == 0){
	echo "Извините, мы не стали загружать ваш файл :(";
}
else{
	if (move_uploaded_file($_FILES["songFile"]["tmp_name"], $target_file)) {
        echo "Файл ". basename( $_FILES["songFile"]["name"]). " был загружен!";
    } else {
        echo "Мы стали загружать ваш файл, но возникла проблема и файл не был загружен :(";
    }
}

?>
</body>
</html>