
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `user_infos`
--

CREATE TABLE `user_infos` (
  `user_id` int NOT NULL,
  `nick` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `user_infos`
--

INSERT INTO `user_infos` (`user_id`, `nick`, `firstname`, `lastname`, `image`) VALUES
(1, '', 'Site', 'Admin', '0'),
(3, 'Writer A', 'Site', 'Writer', '/img/writers/3.jpeg');
