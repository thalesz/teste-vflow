class Anexo {
    constructor(id, nome, conteudo) {
        this.id = id;
        this.nome = nome;
        this.conteudo = conteudo;
    }
}

class GerenciadorAnexos {
    constructor(containerId, templateId, buttonId, fileInputId) {
        this.$container = $('#' + containerId);
        this.templateHTML = $('#' + templateId).html();
        this.$addButton = $('#' + buttonId);
        this.$fileInput = $('#' + fileInputId);
        this.anexoCount = 0;
        this.anexos = [];

        // Carregar anexos do sessionStorage
        this.carregarAnexos();

        // Adiciona o evento de clique ao botão
        this.$addButton.on('click', () => this.$fileInput.click());

        // Adiciona o evento de mudança ao input de arquivo
        this.$fileInput.on('change', (event) => this.manipularArquivo(event));

        // Adiciona eventos para os botões de remover e visualizar
        this.$container.on('click', '.remove-product-btn', (event) => this.removerAnexo(event));
        this.$container.on('click', '.view-product-btn', (event) => this.visualizarAnexo(event));
        this.$container.on('click', '.download-product-btn', (event) => this.baixarAnexo(event));
    }

    manipularArquivo(event) {
        const arquivo = event.target.files[0];

        if (arquivo) {
            const nomeAnexo = arquivo.name;
            const tipoAnexo = arquivo.type;
            const formatosPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'application/json'];

            if (!formatosPermitidos.includes(tipoAnexo)) {
                alert('Formato de arquivo inválido. Apenas PDF, imagens (JPEG, PNG) e JSON são permitidos.');
                return;
            }

            const anexoExistente = this.anexos.find(anexo => anexo.nome === nomeAnexo);

            if (anexoExistente) {
                alert('Um anexo com esse nome já existe. Por favor, escolha um arquivo diferente.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.anexoCount++;
                const novoAnexo = new Anexo(this.anexoCount, nomeAnexo, e.target.result);

                // Adiciona o novo anexo ao array
                this.anexos.push(novoAnexo);

                // Salva no sessionStorage
                sessionStorage.setItem('anexos', JSON.stringify(this.anexos));

                // Re-renderiza o container
                this.renderizarAnexos();
            };

            reader.readAsDataURL(arquivo);
        }
    }

    adicionarAnexoHTML(anexo) {
        let novoAnexoHTML = this.templateHTML
            .replace(/titulo/g, anexo.nome)
            .replace(/anexo-id/g, anexo.id);

        // Criar um novo elemento com o HTML do template
        const $novoAnexo = $('<div>').html(novoAnexoHTML);

        // Atribuir o data-key ao elemento pai que contém o botão de remover
        $novoAnexo.find('.remove-product-btn').attr('data-key', `anexo-id-${anexo.id}`);
        $novoAnexo.find('.view-product-btn').attr('data-key', `anexo-id-${anexo.id}`);
        $novoAnexo.find('.download-product-btn').attr('data-key', `anexo-id-${anexo.id}`);

        return $novoAnexo.children();
    }

    removerAnexo(event) {
        const $button = $(event.currentTarget);
        const dataKey = $button.attr('data-key');
        if (!dataKey) {
            console.error('Data-key não encontrado no botão de remover.');
            return;
        }
        
        const id = parseInt(dataKey.split('-')[2], 10);
        if (isNaN(id)) {
            console.error('ID do anexo não é um número válido:', dataKey);
            return;
        }
        
        // Remove o anexo do array
        this.anexos = this.anexos.filter(anexo => anexo.id !== id);
        
        // Remove o anexo do sessionStorage
        sessionStorage.setItem('anexos', JSON.stringify(this.anexos));

        // Re-renderiza o container
        this.renderizarAnexos();
    }

    renderizarAnexos() {
        // Limpa o container
        this.$container.empty();

        // Re-adiciona todos os anexos
        this.anexos.forEach(anexo => this.$container.append(this.adicionarAnexoHTML(anexo)));

        // Verifica se não há mais anexos e adiciona a mensagem inicial se necessário
        if (this.anexos.length === 0) {
            this.$container.append('<div class="d-flex flex-column flex-grow-1 border border-dark rounded py-2"><p class="bg-white text-black p-1 fs-10 m-0">Adicione um arquivo</p></div>');
        }
    }

    carregarAnexos() {
        const anexosSalvos = JSON.parse(sessionStorage.getItem('anexos')) || [];
        this.anexos = anexosSalvos.map(a => new Anexo(a.id, a.nome, a.conteudo));
        this.renderizarAnexos();
    }

    visualizarAnexo(event) {
        const $button = $(event.currentTarget);
        const id = parseInt($button.attr('data-key').split('-')[2], 10);
        const anexo = this.anexos.find(a => a.id === id);
        if (anexo) {
            const blob = this.dataURLToBlob(anexo.conteudo);
            const url = URL.createObjectURL(blob);
            
            // Abre o PDF em uma nova aba
            window.open(url);
        }
    }

    baixarAnexo(event) {
        const $button = $(event.currentTarget);
        const id = parseInt($button.attr('data-key').split('-')[2], 10);
        const anexo = this.anexos.find(a => a.id === id);
        if (anexo) {
            const blob = this.dataURLToBlob(anexo.conteudo);
            const url = URL.createObjectURL(blob);
            
            // Cria um link para download e clica nele
            const a = document.createElement('a');
            a.href = url;
            a.download = anexo.nome;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    dataURLToBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
    getAnexos() {
        return this.anexos.map(anexo => ({
            id: anexo.id,
            nomeArquivo: anexo.nome,
            blobArquivo: anexo.conteudo
        }));
    }
}
