
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `page_languages`
--

CREATE TABLE `page_languages` (
  `language_id` int NOT NULL,
  `language` text
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `page_languages`
--

INSERT INTO `page_languages` (`language_id`, `language`) VALUES
(2, 'en');
