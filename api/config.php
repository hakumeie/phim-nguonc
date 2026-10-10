<?php
session_start();
if (empty($_SESSION['auth'])) {
    http_response_code(403);
    exit(json_encode(['error' => 'Unauthorized']));
}
header('Content-Type: application/json; charset=utf-8');

const BASE = 'https://phim.nguonc.com/api/films';
const ROUTES = [
    'phim-moi'      => ['tpl' => '/phim-moi-cap-nhat',    'param' => null],
    'search'        => ['tpl' => '/search',               'param' => 'keyword', 'query' => true],
    'danh-sach'     => ['tpl' => '/danh-sach/%s',          'param' => 'type'],
    'the-loai'      => ['tpl' => '/the-loai/%s',           'param' => 'genre'],
    'quoc-gia'      => ['tpl' => '/quoc-gia/%s',           'param' => 'country'],
    'nam-phat-hanh' => ['tpl' => '/nam-phat-hanh/%s',      'param' => 'year'],
];

$action = $_GET['action'] ?? '';
$page = max(1, (int) ($_GET['page'] ?? 1));

if ($action === 'film-detail') {
    $slug = $_GET['slug'] ?? '';
    if (!$slug) { http_response_code(400); exit(json_encode(['error' => 'Thieu slug'])); }
    $url = "https://phim.nguonc.com/api/film/" . urlencode($slug);
} elseif (isset(ROUTES[$action])) {
    $r = ROUTES[$action];
    if ($r['param'] === null) {
        $url = BASE . $r['tpl'] . "?page={$page}";
    } else {
        $val = $_GET[$r['param']] ?? '';
        if (!$val) { http_response_code(400); exit(json_encode(['error' => "Thieu {$r['param']}"])); }
        $url = !empty($r['query'])
            ? BASE . $r['tpl'] . "?{$r['param']}=" . urlencode($val) . "&page={$page}"
            : BASE . sprintf($r['tpl'], urlencode($val)) . "?page={$page}";
    }
} else {
    http_response_code(400);
    exit(json_encode(['error' => 'Action khong hop le']));
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true, // local/dev only; bật lại true khi lên production
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    exit(json_encode(['error' => 'Khong the ket noi toi nguon du lieu']));
}

http_response_code($httpCode);
echo $response;