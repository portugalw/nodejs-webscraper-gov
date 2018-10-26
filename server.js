var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// Escolhendo no metodo .get() o caminho para fazer a requisição
// Poderia ser somente a barra, mas para facilitar a compreensão vamos personalizar
app.get('/raspagem', function(req, res) {

    // Url a ser feita a raspagem de dados
    url = 'http://www.portaldatransparencia.gov.br/cartoes/consulta?tipoCartao=3&de=01%2F01%2F2018&ate=31%2F12%2F2018&ordenarPor=valorTotal&direcao=desc';

    // Metodo que faz a requisição para tratarmos (raspar) os dados
    request(url, function(error, response, html) {

        if (!error) {
            // Preparando o cheeriojs para ler o DOM ~ le jQuery selector
            var $ = cheerio.load(html);

            // Objeto que ira armazenar a tabela
            var resultado = [];

            // Escolhendo a tabela para fazer a raspagem
            // e percorrendo as linhas 
            $('#lista tr:not(:first-child)').each(function(i) {
                // Obtendo as propriedades do objeto
                var codigo = $(this).find('td').eq(0).find('span').text().trim(),
                    orgao = $(this).find('td').eq(3).find('span').text().trim(),
                    valorTotal = $(this).find('td').eq(8).find('span').text().trim();
                // Inserindo os dados num array
                resultado.push({
                    codigo: codigo,
                    orgao: orgao,
                    total: valorTotal
                });
            });
        }
		else{
			console.log(error);
		}
		

        // Escrevendo o arquivo .json com o array 
        fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
            console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
        })

        res.send('Dados raspados com sucesso! Verifique no seu node console.');
    })
})


// Execução do serviço
app.listen('8081')
console.log('Executando raspagem de dados na porta 8081...');
exports = module.exports = app;