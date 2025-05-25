
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admin_infos`
--

CREATE TABLE `admin_infos` (
  `id` int NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `admin_infos`
--

INSERT INTO `admin_infos` (`id`, `firstname`, `lastname`, `img`, `created_at`) VALUES
(1, 'Site', 'Admin', '0', '2024-09-13 04:01:41'),
(3, 'Site', 'Writer', '0', '2024-09-13 04:01:41');
