# 💻 TrafficVision Web

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)

Frontend oficial do ecossistema **TrafficVision**. Esta aplicação fornece a interface para upload de imagens de veículos e visualização dos relatórios de infração gerados pelo Backend.

> 🔗 **Backend Principal:** [TrafficVision API](https://github.com/joseHenrique346/TrafficVision)

---

## Funcionalidades

- **Upload Intuitivo:** Interface para envio de fotos de placas.
- **Visualização de Status:** Feedback em tempo real sobre o processamento (OCR -> Consulta gRPC -> Geração de PDF).
- **Download de Relatório:** Link direto para baixar o PDF gerado pela API.

## Como Rodar

### Pré-requisitos
- Node.js (v18 ou superior)
- Backend `TrafficVision.Api` rodando localmente.

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/joseHenrique346/Front-TrafficVision.git](https://github.com/joseHenrique346/Front-TrafficVision.git)
   cd Front-TrafficVision
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```
   
3. Configure a URL da API:
   - Edite o arquivo de configuração de serviços (ex: my-app/services/apiConection.js).
   - Aponte para seu backend local (geralmente https://localhost:7100 ou similar).
     
5. Execute o projeto:
  ```bash
  cd my-app
  npm run web
  ```

## 👨‍💻 Autores
### José Henrique Fernandes Desenvolvedor Backend em formação com foco em .NET.
- [Linkedin](https://www.linkedin.com/in/jos%C3%A9fernandes346/)

### Carlos Henrique Legutcke Desenvolvedor Fullstack em formação com foco em Rect e Java.
- [Github](https://github.com/CarlosLeutcke)
