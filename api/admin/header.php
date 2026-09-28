<?php
require_once dirname(__DIR__, 2) . '/config/database.php';
require_once dirname(__DIR__, 2) . '/includes/auth.php';
require_once dirname(__DIR__, 2) . '/includes/function.php';
require_once dirname(__DIR__, 2) . '/includes/crud.php';

header('Content-Type: application/json');
requireApiLogin();

handleSectionCrud(getPDO(), 'header');
