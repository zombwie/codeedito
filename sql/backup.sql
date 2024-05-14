x-- MariaDB dump 10.19-11.1.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: editorapp
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `kunder`
--

DROP TABLE IF EXISTS `kunder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kunder` (
  `kundeId` int(11) NOT NULL AUTO_INCREMENT,
  `brukernavn` varchar(255) DEFAULT NULL,
  `passord` varchar(255) DEFAULT NULL,
  `epost` varchar(255) DEFAULT NULL,
  `profilepicId` mediumtext DEFAULT NULL,
  PRIMARY KEY (`kundeId`),
  UNIQUE KEY `kundeId_UNIQUE` (`kundeId`),
  UNIQUE KEY `brukernavn_UNIQUE` (`brukernavn`),
  UNIQUE KEY `epost_UNIQUE` (`epost`),
  UNIQUE KEY `profilepicId_UNIQUE` (`profilepicId`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf32 COLLATE=utf32_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kunder`
--

LOCK TABLES `kunder` WRITE;
/*!40000 ALTER TABLE `kunder` DISABLE KEYS */;
INSERT INTO `kunder` VALUES
(1,'oliver','gsbB0MLW#s@@QfQRxKt1oa3jWQjpEP56jVj!KldjMk@s9jojhjdtVdG06TV59$Dhk^k%ckbqSN&Fa%y8%a$b1ZTop7AOsU@z0Tn','oliver@onowingerei.com','1715158412650-myg.png'),
(2,'sad','dsf','dsfs',NULL),
(3,'sdcdsfdsf','test','sdfdsf@gmail.com','1715676580896-myg.png');
/*!40000 ALTER TABLE `kunder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prosjekter`
--

DROP TABLE IF EXISTS `prosjekter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prosjekter` (
  `KundeId` int(11) NOT NULL,
  `Laget` datetime NOT NULL,
  `ProsjektId` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ProsjektId`),
  UNIQUE KEY `prosjektid_UNIQUE` (`ProsjektId`),
  KEY `fk_Prosjekter_Kunder1_idx` (`KundeId`),
  CONSTRAINT `fk_Prosjekter_Kunder1` FOREIGN KEY (`KundeId`) REFERENCES `kunder` (`kundeId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf32 COLLATE=utf32_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosjekter`
--

LOCK TABLES `prosjekter` WRITE;
/*!40000 ALTER TABLE `prosjekter` DISABLE KEYS */;
INSERT INTO `prosjekter` VALUES
(1,'2024-05-08 10:34:14',6),
(1,'2024-05-08 10:53:01',7),
(3,'2024-05-14 10:49:25',8);
/*!40000 ALTER TABLE `prosjekter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prosjektinnhold`
--

DROP TABLE IF EXISTS `prosjektinnhold`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prosjektinnhold` (
  `ProsjektId` int(11) NOT NULL,
  `css` longtext DEFAULT NULL,
  `html` longtext DEFAULT NULL,
  `js` longtext DEFAULT NULL,
  PRIMARY KEY (`ProsjektId`),
  CONSTRAINT `fk_ProsjektInnhold_Prosjekter1` FOREIGN KEY (`ProsjektId`) REFERENCES `prosjekter` (`ProsjektId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosjektinnhold`
--

LOCK TABLES `prosjektinnhold` WRITE;
/*!40000 ALTER TABLE `prosjektinnhold` DISABLE KEYS */;
INSERT INTO `prosjektinnhold` VALUES
(6,'body {\n    background-color: black;\n}\nh1 {\n    color: white;\n    font-size: 100vh;\n}','<h1>yo</h1>',''),
(7,'','',''),
(8,'','<h1>Neger</h1>','');
/*!40000 ALTER TABLE `prosjektinnhold` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-14 12:59:45
