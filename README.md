# Cadastro de Fornecedores

## 🚀 Sobre o Desafio

O **Cadastro de Fornecedores** é um projeto para desenvolver um formulário de cadastro de fornecedores e produtos. O formulário deve seguir o layout fornecido e atender aos requisitos técnicos especificados.

## 📋 Requisitos

Para este projeto, os seguintes requisitos e tecnologias devem ser utilizados:

- **HTML**: Versão 5
- **JavaScript**: Preferência por ES6+
- **Bootstrap**: Para estilização e layout
- **CSS**: Para personalização adicional
- **jQuery 3.5.1**: Para manipulação do DOM e eventos
- **Documentação**: Utilizar a documentação de recursos e estilos fornecida

### Campos do Formulário

**Fornecedor:**
- Razão Social: obrigatório
- Nome Fantasia: obrigatório
- CNPJ: obrigatório
- Inscrição Estadual: opcional
- Inscrição Municipal: opcional
- Endereço: obrigatório (preenchido automaticamente usando a API via CEP)
- Nome da pessoa de contato: obrigatório
- Telefone: obrigatório
- E-mail: obrigatório

**Tabela de Produtos:**
- Descrição: obrigatório
- Unidade de Medida: obrigatório
- Quantidade em Estoque: obrigatório
- Valor Unitário: obrigatório
- Valor Total: obrigatório (calculado automaticamente como valor unitário x quantidade em estoque)

**Tabela de Anexos:**
- Inclusão de pelo menos 1 documento é obrigatória
- Documentos anexados devem ser armazenados em memória (blob e session storage)
- Botão Excluir (lixeira): remove o documento da memória
- Botão Visualizar (olho): permite o download do documento
- Botão Salvar Fornecedor: abre um modal de loading e formata um JSON com os dados a serem enviados

## 🛠 Instalação
Acesse usando: https://cadastro-fornecedor-produto.onrender.com/
Para instalar o projeto e iniciar o servidor local, siga os passos abaixo:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cadastro-fornecedores.git

# 2. Navegue até o diretório do projeto
cd cadastro-fornecedores

# 3. Instale o live-server globalmente se ainda não estiver instalado
npm install -g live-server

# 4. Inicie o live-server
live-server

