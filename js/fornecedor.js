class Fornecedor {
    constructor() {
        this.dados = {
            razaoSocial: '',
            cnpj: '',
            nomeFantasia: '',
            inscricaoEstadual: '',
            cep: '',
            inscricaoMunicipal: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            municipio: '',
            estado: '',
            nomePessoaContato: '',
            telefone: '',
            email: ''
        };

        this.init();
    }

    init() {
        // Vincula eventos de entrada aos campos do formulário
        $('#razaoSocial').on('input', (e) => this.updateData('razaoSocial', e.target.value));
        $('#cnpj').on('input', (e) => this.validateAndUpdate('cnpj', e.target.value, /^\d{0,14}$/, 14));
        $('#nomeFantasia').on('input', (e) => this.updateData('nomeFantasia', e.target.value));
        $('#inscricaoEstadual').on('input', (e) => this.validateAndUpdate('inscricaoEstadual', e.target.value, /^\d{0,12}$/, 12));
        $('#cep').on('input', (e) => this.handleCepChange(e.target.value));
        $('#inscricaoMunicipal').on('input', (e) => this.validateAndUpdate('inscricaoMunicipal', e.target.value, /^\d{0,12}$/, 12));
        $('#endereco').on('input', (e) => this.updateData('endereco', e.target.value));
        $('#numero').on('input', (e) => this.validateAndUpdate('numero', e.target.value, /^\d*$/));
        $('#complemento').on('input', (e) => this.updateData('complemento', e.target.value));
        $('#bairro').on('input', (e) => this.updateData('bairro', e.target.value));
        $('#municipio').on('input', (e) => this.updateData('municipio', e.target.value));
        $('#estado').on('input', (e) => this.updateData('estado', e.target.value));
        $('#nomePessoaContato').on('input', (e) => this.updateData('nomePessoaContato', e.target.value));
        $('#telefone').on('input', (e) => this.validateAndUpdate('telefone', e.target.value, /^\d*$/));
        $('#email').on('input', (e) => this.validateAndUpdate('email', e.target.value, /.*/)); // Permite qualquer formato de email
    }

    handleCepChange(value) {
        const cleanedValue = value.replace(/[^\d]/g, '');
        const limitedValue = cleanedValue.substring(0, 8);
        const cepRegex = /^\d{8}$/; // CEP com 8 dígitos

        if (cepRegex.test(limitedValue)) {
            this.validateAndUpdate('cep', limitedValue, cepRegex);
            this.fetchAddressByCep(limitedValue);
        } else {
            console.log('CEP inválido ou incompleto.');
            this.updateData('cep', limitedValue); // Atualiza com o valor limpo
            this.unmarkFieldValid('cep');
        }
    }

    fetchAddressByCep(cep) {
        $.ajax({
            url: `https://viacep.com.br/ws/${cep}/json/`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                if (data && !data.erro) {
                    this.updateData('endereco', data.logradouro);
                    this.updateData('bairro', data.bairro);
                    this.updateData('municipio', data.localidade);
                    this.updateData('estado', data.uf);
                } else {
                    alert('CEP não encontrado.');
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log('Erro na requisição:', textStatus, errorThrown);
                alert('Erro ao buscar o endereço.');
            }
        });
    }

    validateAndUpdate(key, value, regex, length = null) {
        // Verifica se o regex é um objeto RegExp válido
        if (regex instanceof RegExp) {
            if (regex.test(value)) {
                this.updateData(key, value);
                if (length !== null && value.length === length) {
                    this.markFieldValid(key);
                } else {
                    this.unmarkFieldValid(key);
                }
            } else {
                $(`#${key}`).val(this.dados[key]);
                this.unmarkFieldValid(key);
            }
        } else {
            console.error(`Regex inválido para ${key}:`, regex);
        }
    }

    updateData(key, value) {
        this.dados[key] = value;
        $(`#${key}`).val(value); // Atualiza o valor do campo do formulário
    }

    markFieldValid(key) {
        $(`#${key}`).css('border', '2px solid green');
    }

    unmarkFieldValid(key) {
        $(`#${key}`).css('border', '');
    }

    getFornecedor() {
        return this.dados;
    }
}