# Clima Atual

Este é um projeto de aplicação de clima desenvolvido em Ionic com Angular. Ele permite aos usuários buscar informações meteorológicas em tempo real usando CEP (para localização inicial) ou nomes de cidades.

## **1\. APIs Utilizadas e Links da Documentação**

O projeto depende principalmente de um serviço externo para obter dados meteorológicos, além das bibliotecas base do framework.

| Tecnologia | Descrição | Link da Documentação |
| :---- | :---- | :---- |
| **Ionic Framework** | Estrutura para desenvolvimento de aplicativos híbridos e Web. | [Documentação Oficial do Ionic](https://ionicframework.com/docs/) |
| **Angular** | Plataforma e estrutura de desenvolvimento usada para construir a interface. | [Documentação Oficial do Angular](https://angular.io/docs) |
| **API Pública** | Serviço de terceiros para dados de temperatura, condição, umidade e vento. | [Documentação Open-Meteo](https://open-meteo.com) |
| **API Pública** | Serviço de terceiros para dados da latitude, longitude e busca por nome da cidade. | [Documentação Geocoding-Api](https://open-meteo.com/en/docs/geocoding-api) |
| **API de CEP** | Serviço de terceiros para busca de cidadades por CEP.| [Documentação ViaCep API](https://viacep.com.br) |



## **2\. Como Rodar o Projeto**

Para configurar e executar o projeto localmente, siga os passos abaixo:

### **Pré-requisitos**

* Node.js (versão LTS recomendada)  
* Ionic CLI (Interface de Linha de Comando do Ionic)

Para instalar o Ionic CLI (caso ainda não o tenha):

npm install \-g @ionic/cli

### **Instalação e Execução**

1. **Clone o repositório:**  
   git clone [https://github.com/ALEKELLEN00/desafio-bios.git]
   
   cd [weather-app]

2. **Instale as dependências:**  
   npm install

  
3. Execute a aplicação:  
   Para rodar a aplicação no seu navegador:  
   ionic serve

   O navegador deverá abrir automaticamente em http://localhost:8100/.

## **3\. Suposições Feitas**

Durante o desenvolvimento, algumas decisões e suposições foram tomadas, que afetam a exibição e o funcionamento:

* **Unidade de Temperatura:** Assume-se que a unidade padrão de exibição é **Celsius (°C)**, conforme a exibição no HTML.  
* **Busca de Localização:** O campo de texto foi configurado para aceitar tanto **CEP (8 dígitos)** quanto **nomes de cidades** (globais). A lógica de validação/encaminhamento da busca ocorre inteiramente no WeatherService.  
* **Fuso Horário (Timezone):** A hora de atualização do clima é tratada pelo DatePipe do Angular. Isso garante que o timestamp (geralmente fornecido em UTC pela API) é **automaticamente convertido** para o fuso horário local do dispositivo do usuário.  
* **Tratamento de Erros:** Apenas uma mensagem genérica de "Local não encontrado" é exibida para qualquer erro retornado pelo serviço.

## **4\. O que Poderia Ser Melhorado**

Existem várias áreas para aprimorar este projeto e adicionar funcionalidade:

* **Ícones Dinâmicos de Clima:** Implementar a exibição de um ícone que mude dinamicamente (sol, nuvem, chuva) de acordo com a propriedade weather.condicao retornada pela API.  
* **Busca por Geolocalização:** Adicionar um botão que use a API de geolocalização do navegador (ou Cordova/Capacitor) para buscar o clima da localização atual do usuário, em vez de exigir a digitação de um termo.  
* **Melhoria na UX de Erros:** Tratar diferentes códigos de erro da API (e.g., erro de servidor, chave inválida) com mensagens mais específicas para o usuário.  
* **Estilização e Responsividade:** Refinar o design do cartão de resultados para telas menores, garantindo que as informações fiquem legíveis e bem organizadas em dispositivos móveis.  
* **Persistência da Última Busca:** Armazenar a última busca bem-sucedida do usuário (usando localStorage ou um serviço de armazenamento nativo) para que a informação de clima seja carregada imediatamente na próxima abertura do app.
* **Maiores informações da Cidade:** Incluir estado e país alem do nome da cidade no resultado da busca.