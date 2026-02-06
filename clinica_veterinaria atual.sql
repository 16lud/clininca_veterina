-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 06/02/2026 às 01:16
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `clinica_veterinaria`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `animais`
--

CREATE TABLE `animais` (
  `id_animal` int(10) UNSIGNED NOT NULL,
  `nome` varchar(50) NOT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `raca` varchar(50) DEFAULT NULL,
  `idade` int(11) DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `id_dono` int(10) UNSIGNED NOT NULL,
  `id_vet` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `animais`
--

INSERT INTO `animais` (`id_animal`, `nome`, `especie`, `raca`, `idade`, `sexo`, `id_dono`, `id_vet`) VALUES
(5, 'pretinha ', 'cachorro', 'dalmata', 2, NULL, 2, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `atendimentos`
--

CREATE TABLE `atendimentos` (
  `id_atendimento` int(10) UNSIGNED NOT NULL,
  `data_atendimento` date NOT NULL,
  `horario` time NOT NULL,
  `observacoes` varchar(200) DEFAULT NULL,
  `id_animal` int(10) UNSIGNED NOT NULL,
  `id_servico` int(10) UNSIGNED NOT NULL,
  `id_vet` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `donos`
--

CREATE TABLE `donos` (
  `id_dono` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `endereco` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `donos`
--

INSERT INTO `donos` (`id_dono`, `nome`, `cpf`, `telefone`, `email`, `endereco`) VALUES
(1, 'Ana Souza', '71582070859', '98888-7777', 'ana.souza@gmail.com.br', 'sao jose de mipibu '),
(2, 'ludmila tawane rodrigues os anjos', '70851922406', '84991829740', 'ludmilatawaneanjo@gmail.com.br', 'natal');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamentos`
--

CREATE TABLE `pagamentos` (
  `id_pagamento` int(10) UNSIGNED NOT NULL,
  `forma_pagamento` varchar(50) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_pagamento` date NOT NULL,
  `id_atendimento` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `servicos`
--

CREATE TABLE `servicos` (
  `id_servico` int(10) UNSIGNED NOT NULL,
  `nome_servico` varchar(100) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `preco_base` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `servicos`
--

INSERT INTO `servicos` (`id_servico`, `nome_servico`, `descricao`, `preco_base`) VALUES
(1, 'Especialidades veterinarias', 'Cardiologia Veterinária,\r\nDermatologia Veterinária,\r\nOrtopedia Veterinária,\r\nOftalmologia Veterinária,\r\nEndocrinologia Veterinária...\r\n\r\n\r\nNeurologia Veterinária\r\n', 200.00),
(2, 'SERVIÇOS CLÍNICOS', 'Consulta Clínica Geral,\r\nAtendimento de Urgência,Emergência\r\nAcompanhamento Clínico...', 100.00),
(3, 'EXAMES E DIAGNÓSTICOS', '\r\nExames Laboratoriais,\r\nUltrassonografia,\r\nRadiografia (Raio-X),\r\nEletrocardiograma (ECG)...\r\n', 150.00),
(4, 'Prevenção e Saúde', 'Vacinação,\r\nVermifugação,\r\nControle de Ectoparasitas.\r\n', 125.00),
(5, 'Procedimentos Cirúrgicos', 'Cirurgia Geral,\r\nCirurgia Ortopédica,\r\nCirurgia Odontológica.\r\n', 250.00),
(6, 'Odontologia Veterinaria', 'Profilaxia Dentária,\r\nTratamento Periodontal.\r\n', 90.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `veterinarios`
--

CREATE TABLE `veterinarios` (
  `id_vet` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `especialidade` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `crmv` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `veterinarios`
--

INSERT INTO `veterinarios` (`id_vet`, `nome`, `especialidade`, `telefone`, `crmv`) VALUES
(2, 'Ana livia souza', 'Ciruria ortopedica', '(34) 98745-3210', 'CRMV-MG 1248'),
(3, 'Lucas Henrique Souza', 'Cardiologia Veterinária', '(11) 97654-8899', 'CRMV-SP 23456'),
(4, 'Mariana Costa Lima', 'Dermatologia Veterinária', '(41) 98877-6654', 'CRM-PR 34567'),
(5, 'Rafael Almeida Nogueira', 'Ortopedia Veterinária', '(51) 97532-1188', 'CRMV-RS 45678'),
(6, 'Beatriz Fernandes Rocha', 'Anestesiologia Veterinária', '(84) 98122-3344', 'CRMV-RN 56789'),
(7, 'Pedro Augusto Martins', 'Cirurgia Geral Veterinária', '(81) 99210-7788', 'CRMV-PE 67890'),
(8, 'Juliana Menezes Pires', 'Oftalmologia Veterinária', '(11) 97411-5566', 'CRMV-SP 78901');

-- --------------------------------------------------------

--
-- Estrutura para tabela `veterinarios_servicos`
--

CREATE TABLE `veterinarios_servicos` (
  `id_vet_servico` int(10) UNSIGNED NOT NULL,
  `id_vet` int(10) UNSIGNED NOT NULL,
  `id_servico` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `animais`
--
ALTER TABLE `animais`
  ADD PRIMARY KEY (`id_animal`),
  ADD KEY `fk_animais_donos` (`id_dono`);

--
-- Índices de tabela `atendimentos`
--
ALTER TABLE `atendimentos`
  ADD PRIMARY KEY (`id_atendimento`),
  ADD KEY `fk_atendimento_animal` (`id_animal`),
  ADD KEY `fk_atendimento_servico` (`id_servico`),
  ADD KEY `fk_atendimento_vet` (`id_vet`);

--
-- Índices de tabela `donos`
--
ALTER TABLE `donos`
  ADD PRIMARY KEY (`id_dono`);

--
-- Índices de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD KEY `fk_pagamento_atendimento` (`id_atendimento`);

--
-- Índices de tabela `servicos`
--
ALTER TABLE `servicos`
  ADD PRIMARY KEY (`id_servico`);

--
-- Índices de tabela `veterinarios`
--
ALTER TABLE `veterinarios`
  ADD PRIMARY KEY (`id_vet`);

--
-- Índices de tabela `veterinarios_servicos`
--
ALTER TABLE `veterinarios_servicos`
  ADD PRIMARY KEY (`id_vet_servico`),
  ADD UNIQUE KEY `uk_vet_servico` (`id_vet`,`id_servico`),
  ADD KEY `fk_vs_servico` (`id_servico`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `animais`
--
ALTER TABLE `animais`
  MODIFY `id_animal` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `atendimentos`
--
ALTER TABLE `atendimentos`
  MODIFY `id_atendimento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `donos`
--
ALTER TABLE `donos`
  MODIFY `id_dono` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  MODIFY `id_pagamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `servicos`
--
ALTER TABLE `servicos`
  MODIFY `id_servico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `veterinarios`
--
ALTER TABLE `veterinarios`
  MODIFY `id_vet` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `veterinarios_servicos`
--
ALTER TABLE `veterinarios_servicos`
  MODIFY `id_vet_servico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `animais`
--
ALTER TABLE `animais`
  ADD CONSTRAINT `fk_animais_donos` FOREIGN KEY (`id_dono`) REFERENCES `donos` (`id_dono`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `atendimentos`
--
ALTER TABLE `atendimentos`
  ADD CONSTRAINT `fk_atendimento_animal` FOREIGN KEY (`id_animal`) REFERENCES `animais` (`id_animal`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_atendimento_servico` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_atendimento_vet` FOREIGN KEY (`id_vet`) REFERENCES `veterinarios` (`id_vet`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD CONSTRAINT `fk_pagamento_atendimento` FOREIGN KEY (`id_atendimento`) REFERENCES `atendimentos` (`id_atendimento`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `veterinarios_servicos`
--
ALTER TABLE `veterinarios_servicos`
  ADD CONSTRAINT `fk_vs_servico` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vs_vet` FOREIGN KEY (`id_vet`) REFERENCES `veterinarios` (`id_vet`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
