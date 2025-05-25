
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `pages`
--

CREATE TABLE `pages` (
  `id` int NOT NULL,
  `page` text,
  `templates` text,
  `localizeds` text
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `pages`
--

INSERT INTO `pages` (`id`, `page`, `templates`, `localizeds`) VALUES
(1, 'policies', 'policies', '{\"en\":\"policies\"}');
