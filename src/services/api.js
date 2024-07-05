import axios from "axios";

// URL da API para obter dados de câmbio de moedas
// https://economia.awesomeapi.com.br/json/all

// Exemplo de rota para buscar a taxa de câmbio de BTC para BRL: all/BTC-BRL

// Cria uma instância do axios com a base URL da API
export const api = axios.create({
    baseURL: "https://economia.awesomeapi.com.br/json/"
})
