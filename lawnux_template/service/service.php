<?php
if (isset($_GET['page'])) {
    $page = $_GET['page'];
} else {
    $page = end(explode('/', $_SERVER['PHP_SELF']));
}

require $_SERVER['DOCUMENT_ROOT'] . '/api/database/Sql.php';

$sql = new Sql();
$mysqli = $sql->connect();

$m = $sql->get($mysqli, 'SELECT * FROM services WHERE page=?', [$page]);

if ($m->result !== 1) {
    exit(0);
}

$data = $m->data[0];

$header = $data['header'];
$keywords = $data['keywords'];
$description = $data['description'];
$header = $data['header'];
$page = $data['page'];
$image = $data['image'];
$content = $data['content'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#16081A" />
    <link href="../css/general/general.css" rel="stylesheet">
    <link href="../css/main/general/main.css" rel="stylesheet">
    <link rel="shortcut icon" href="../img/favicon.ico">
    <link rel="apple-touch-icon" href="../img/favicon.png">
    <meta name="google-signin-client_id" content="543195609549-2th51s0f8r2ho8hh9mcnrbarfohr0jnn.apps.googleusercontent.com">
    <title><?php echo $header; ?> - {site}</title>
    <meta name="keywords" content="<?php echo $keywords; ?>">
    <meta name="description" content="<?php echo $description; ?>">
    <meta name="og:image" content="<?php echo $image; ?>">
    <link href="../css/lib/kalenux/select.css" rel="stylesheet">
    <link href="../css/main/page.css" rel="stylesheet" />
    <script src="../js/general/header.js"></script>
    <script src="../js/main/general/header.js"></script>
</head>

<body class="preload">
    <div class="cookie" id="cookie">
        <div class="cookie-bg"></div>
        <div class="cookie-inner">
            <p>We use cookies to offer you a better experience on our website. By continuing, you agree to our <a href="../policies#kvkk" class="underline">Cookie Policy</a>.</p>
            <button class="btn btn-blue" onclick="acceptCookie()">Accept</button>
        </div>
    </div>
    <div class="preloader" id="preloader" data-state="open" style="width:100%;height:100%;position:fixed;left:0;top:0;z-index:99999999;background:var(--primary-color);">
        <div class="preload-inner" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;">
            <img src="../img/logo.png" style="width:500px;animation:preloader 1s infinite;">
        </div>
    </div>
    <style id="devicewidth">
        :root {
            --dwidth: 1910px;
        }
    </style>
    <div class="home-top">
        <div class="header" id="header">
            <div class="header-bg"></div>
            <div class="header-holder">
                <div class="header-inner">
                    <a class="header-logo" href="../" title="Lawnux Law and Consultancy Firm - Anasayfa">
                        <img class="header-img" src="../img/logo.png" alt="Lawnux Law and Consultancy Firm">
                    </a>
                    <ul class="header-navs" id="general_header_menu">
                        <li class="header-nav"><a href="../home.html">Home</a></li>
                        <li class="header-nav"><a href="../about-us.html">About Us</a></li>
                        <li class="header-nav"><a href="../our-services.html">Our Services</a></li>
                        <li class="header-nav"><a href="../blog.html">Blog</a></li>
                        <li class="header-nav"><a href="../career.html">Career</a></li>
                        <li class="header-nav"><a href="../contact.html">Contact</a></li>
                        <li class="header-nav header-menu"><span class="icon-menu copen" data-to="menu"></li>
                        <li class="header-nav social-medias">
                            <a class="social-media" href="https://instagram.com/lawnux"><span class="icon-instagram"></span></a>
                            <a class="social-media" href="https://www.linkedin.com/in/lawnux"><span class="icon-linkedin"></span></a>
                            <a class="social-media" href="https://www.youtube.com/channel/lawnux"><span class="icon-youtube"></span></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="header-mobile-menu" id="menu">
                <div class="hmm-inner">
                    <div class="hmm-bg"></div>
                    <ul class="hmm-minner">
                        <li><a href="../home.html">Home</a></li>
                        <li><a href="../about-us.html">About Us</a></li>
                        <li><a href="../our-services.html">Our Services</a></li>
                        <li><a href="../blog.html">Blog</a></li>
                        <li><a href="../career.html">Career</a></li>
                        <li><a href="../contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="menu-close copen" data-the="menu"></div>
            </div>
        </div>
        <div class="ht-inner">
            <h1 class="ht-header sep sep-secondary"><?php echo $header; ?></h1>
        </div>
        <div class="ht-bg" style="background-image:url(<?php echo $image; ?>)"></div>
        <div class="ht-bg ht-bg-filter"></div>
    </div>
    <div class="content widther">
        <div class="content-inner">
            <?php echo $content; ?>
        </div>
    </div>
    <footer>
        <div class="footer-top">
            <div class="footer-parts">
                <div class="footer-part">
                    <img class="footer-logo" src="../img/logo.png">
                    <a class="footer-social" href="tel:+12345678901">
                        <span class="icon-phone"></span>
                        <p>+1 234 567 8901</p>
                    </a>
                    <a class="footer-social" href="mailto:info@lawnux.av.tr">
                        <span class="icon-mail"></span>
                        <p>info@lawnux.av.tr</p>
                    </a>
                    <a class="footer-social" href=" " target="_blank">
                        <span class="icon-home"></span>
                        <p>Sunset Boulevard, Suite 300 <br> Building No: 22 Floor: 5 Apartment: 101 <br> Beverly Hills,
                            CA 90210
                        </p>
                    </a>
                    <div class="footer-top-bg"></div>
                </div>
                <div class="footer-part">
                    <h3>OUR SERVICES</h3>
                    <div class="footer-services">
                        <ul class="kalenux-tables" data-type="main" data-url="get/services" data-id="services"></ul>
                    </div>
                    <kalenux-template id="services">
                        <services>
                            <li><a href="../service/+page+">+header+</a></li>
                        </services>
                    </kalenux-template>
                </div>
                <div class="footer-part">
                    <h3>BAĞLANTILAR</h3>
                    <ul class="footer-services">
                        <li class="footer-service">
                            <a href="../home.html">Home</a>
                        </li>

                        <li class="footer-service">
                            <a href="../about-us.html">About Us</a>
                        </li>

                        <li class="footer-service">
                            <a href="../our-services.html">Our Services</a>
                        </li>

                        <li class="footer-service">
                            <a href="../blog.html">Blog</a>
                        </li>

                        <li class="footer-service">
                            <a href="../career.html">Career</a>
                        </li>

                        <li class="footer-service">
                            <a href="../contact.html">Contact</a>
                        </li>

                        <li class="footer-service">
                            <a href="../policies.html">Policies</a>
                        </li>

                        <li><a href="../form.pdf">KVKK Agreement Form</a>
                        </li>
                    </ul>
                    <div class="social-medias">
                        <a class="social-media" href="https://instagram.com/lawnux" target="_blank"><span class="icon-instagram"></span></a>
                        <a class="social-media" href="https://www.linkedin.com/in/lawnux" target="_blank"><span class="icon-linkedin"></span></a>
                        <a class="social-media" href="https://www.youtube.com/channel/lawnux" target="_blank"><span class="icon-youtube"></span></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bot">
            <p>Copyright © 2021 Lawnux Law and Consultancy Firm - Tüm Hakları Saklıdır.</p>
        </div>
    </footer>
    <script src="../js/lib/kalenux/templater.js" defer></script>
    <script src="../js/lib/kalenux/kalenux_table.js" defer></script>
    <script src="../js/lib/kalenux/select.js" defer></script>
    <script src="../js/lib/kalenux/popup.js" defer></script>
    <script defer src="../js/general/footer.defer.js"></script>
    <script src="../js/main/general/footer.defer.js"></script>
</body>

</html>