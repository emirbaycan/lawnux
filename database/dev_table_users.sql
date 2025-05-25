
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `type` tinyint DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_rank` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `type`, `email`, `username`, `password`, `user_rank`, `created_at`) VALUES
(1, 1, 'emir-baycan@hotmail.com', 'admin', '$2b$12$r5TT0.nXR8bvq9A8Xkf4q.BICHcaqzxYVbledFzVQXaoNBIQ8dc4i', 3, '2024-09-13 03:51:52'),
(3, 1, 'writer@hotmail.com', 'writer', '$2b$12$r5TT0.nXR8bvq9A8Xkf4q.BICHcaqzxYVbledFzVQXaoNBIQ8dc4i', 1, '2024-09-13 03:52:07');
