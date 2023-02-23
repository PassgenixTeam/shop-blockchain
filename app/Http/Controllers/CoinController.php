<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class CoinController extends Controller
{
    function getCoin() {
        $symbol = request('symbol');
        $client = new Client();
        $url = 'https://api.binance.com/api/v3/ticker/price?symbols=' . $symbol;
        // $response = $client->get($url);
        $response = $client->request('GET', $url, [
            'headers' => [
                'X-MBX-APIKEY' => '0VBHGpJZzXVH7DT9T4VACj4JaR0Ujxu7Q3epGEq8yGWv7gj8vh3af4s3tRrVfo7a'
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data;
    }

    function getCoinPrice($symbol) {
        $client = new Client();
        $url = 'https://api.binance.com/api/v3/ticker/price?symbol=' . $symbol;
        // $response = $client->get($url);
        $response = $client->request('GET', $url, [
            'headers' => [
                'X-MBX-APIKEY' => '0VBHGpJZzXVH7DT9T4VACj4JaR0Ujxu7Q3epGEq8yGWv7gj8vh3af4s3tRrVfo7a'
            ]
        ]);

        $data = $response->getBody();
        return json_decode($data);
    }
}
