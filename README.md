# Lawnux - Law Firm & Lawyer Full Website Template

Lawnux is a production-ready, responsive, and feature-rich website template designed for law firms and individual lawyers. Built on the LAMP stack (Linux, Apache, MySQL, PHP) and crafted with the Kalenuxer toolkit, it provides a robust foundation for creating a modern legal website with content management, admin and writer panels, dynamic services, blog, and more.

---

## Table of Contents

* [Introduction](#introduction)
* [Requirements](#requirements)
* [Installation](#installation)
* [File Structure](#file-structure)
* [API Structure](#api-structure)
* [HTML Structure](#html-structure)
* [CSS Structure](#css-structure)
* [JavaScript Structure](#javascript-structure)
* [Lib Structure](#lib-structure)
* [Customization](#customization)

  * [Change Fonts](#change-fonts)
  * [Change Sizes](#change-sizes)
  * [Change Colors](#change-colors)
  * [Change Favicon](#change-favicon)
  * [Change Logo](#change-logo)
  * [Change Background Image](#change-background-image)
* [Support](#support)
* [Changelog](#changelog)

---

## Introduction

Lawnux is a full-featured law firm & lawyer website template using **HTML, CSS, JS, and PHP**. It’s fully responsive, modern in design, and built for optimal speed and SEO performance. The template comes with comprehensive documentation for quick and easy deployment.

## Requirements

To use Lawnux, you should have:

* A web server (Apache recommended)
* PHP & MySQL
* FTP access for deployment
* phpMyAdmin (for quick database setup)

**Required directories/files:**

* `css` (Stylesheets)
* `js` (Scripts)
* `img` (Images)
* `fonts` (Fonts)
* `plugins` (jQuery, DatePicker, DataTables, etc.)
* `api` (PHP backend)
* `admin` (Admin panel)
* `writer` (Writer panel)
* Main HTML files (e.g. `home.html`, `about-us.html`, etc.)

---

## Installation

1. **Extract Files:** Unzip the package to your local/server directory.
2. **Upload Files:** Transfer all template files to your web server via FTP.
3. **Database Setup:**

   * Import SQL files from the `database` folder into your MySQL database using phpMyAdmin.
   * Create an admin user during setup as prompted.
4. **API Setup:**

   * Edit `api/lib/database/Sql.php` to configure your MySQL connection.
   * Configure mail settings in `api/lib/mailerMailer.php` as needed.
5. **Login:**

   * Visit `/login` to access the admin panel.
   * Use `/messages`, `/applications`, `/services`, `/articles`, `/policies`, `/users`, `/writers` to manage content.
6. **Content Editing:**

   * Edit HTML, PHP files, and images in `img/` as needed for your firm.

---

## File Structure

```
Lawnux Template/
├── admin/         # Admin management panel
│   ├── messages.html
│   ├── applications.html
│   ├── services.html
│   ├── articles.html
│   ├── policies.html
│   ├── users.html
│   └── writers.html
├── writer/        # Writer's panel
│   └── articles.html
├── api/           # Backend PHP APIs
│   ├── general/
│   ├── lib/       # Core libraries (file, database, kalenux, mailer, etc.)
│   ├── main/      # Visitor-facing API
│   └── users/     # User (admin, writer) APIs
├── css/
├── img/
├── js/
├── plugins/       # jQuery, datepicker, datatables, etc.
├── articles/
├── service/
├── policy/
├── writer/
├── .htaccess
├── 404.html
├── icons.html
├── home.html
├── about-us.html
└── contact.html
```

---

## API Structure

* **Database config:** `api/lib/database/Sql.php`
* **Mail config:** `api/lib/mailerMailer.php`
* **Directory breakdown:**

  * `api/general/`: Universal scripts
  * `api/main/`: Public API endpoints
  * `api/users/`: Admin & writer APIs, organized as `add`, `do`, `get`, `upload`
* **Reusable modules:**

  * SQL: `api/lib/database/Sql.php`
  * Dynamic page creation: `api/lib/kalenux/Kalenux.php`
  * File handling: `api/lib/file/File.php`

---

## HTML Structure

* Use unique titles, keywords, descriptions, and `og:image` on every HTML page for SEO.
* Cookie agreement and preloader included on all pages.
* Header and footer present on every page for all devices.
* Per-page CSS and JS for modular customization.

**Main Files:**

* `*.html`: Main content pages
* `admin/*.html`: Admin panel
* `writer/*.html`: Writer panel
* `article/article.php`: Article page template
* `service/service.php`: Service page template
* `policy/policy.php`: Policy page template
* `writer/writer.php`: Writer page template

---

## CSS Structure

* `general/general.css`: Global resets, device compatibility, responsiveness
* `lib/kalenux/*.css`: Core Kalenuxer plugins
* `main/general/main.css`: Universal styles except admin panels
* `main/pages/*`: Page-specific styles
* `main/users/*`: Admin panel styles
* `page.css`: Breadcrumb styling for all pages

---

## JavaScript Structure

* Footer loading for improved speed
* `general/header.js`: Core utilities, always loaded first
* `general/footer.defer.js`: Executes after DOM loaded
* `lib/`: Kalenuxer JS plugins
* `main/general/header.js` and `footer.defer.js`: Universal scripts
* `main/pages/*`: Page-specific JS
* `main/users/*`: Admin panel scripts

---

## Lib Structure

* Shared modules for CSS, JS, and PHP:

  * `kalenux/kalenux_table`: Management panel tables
  * `kalenux/compress`: Image compression
  * `kalenux/file`: File input utilities
  * `kalenux/checkbox`: Custom checkboxes
  * `kalenux/option`: Option selections
  * `kalenux/templater`: HTML template utilities
  * `kalenux/popup`: Popup window support

---

## Customization

### Change Fonts

* Edit font imports and `font-family` in `css/general/general.css`.
* Add new fonts using [Google Fonts](https://fonts.google.com/) and update the `@font-face` rule.

### Change Sizes

* Adjust all base sizes using:

  ```css
  html {
    font-size: 13px;
  }
  ```

  in your global CSS.

### Change Colors

* Edit color variables in `css/general/general.scss`:

  ```css
  :root {
    --primary-color: #171f34;
    --gray-color: #f3f2f0;
    --secondary-color: #ceac6e;
    ...
  }
  ```

### Change Favicon

* Replace `img/favicon.png` with your new favicon.
* Reference in your HTML:

  ```html
  <link href="img/favicon.png" rel="icon">
  ```

### Change Logo

* Replace `img/logo/logo.png` with your logo.
* Update references in HTML as needed:

  ```html
  <img src="img/logo/logo.png">
  ```

### Change Background Image

* For pages with a breadcrumb area, replace images in `img/` or update the `background-image` style for elements with the `ht-bg` class.

  ```html
  <div class="ht-bg" style="background-image:url(/img/blog.jpg)"></div>
  ```

---

## Support

If you need any help, feel free to contact me anytime. I will reply within 24 hours.

---

## Changelog

* **Initial Release v1.0:** September 2024

---

## License

Contact the author for commercial use or redistribution rights.

---

## Author

Developed and maintained by [Emir Baycan](https://emirbaycan.com.tr/).
