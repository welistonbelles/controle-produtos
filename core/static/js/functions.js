$(document).ready(function() {

    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#endereco").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#estado").val("");
    }

    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');
        
        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("#endereco").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#estado").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#endereco").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#estado").val(dados.uf);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
});

function registerProduct() {
    let name = document.querySelector("#name").value;
    let price = document.querySelector("#price").value;
    let stock = document.querySelector("#stock").value;

    let data = {
        "name": name,
        "price": price,
        "stock": stock
    }
    const csrftoken = getCookie('csrftoken');
    const request = new Request(`http://127.0.0.1:8000/api/v1/products/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            mode: 'same-origin',
            body: JSON.stringify(data)
        }
    )
    fetch(request).then(res => {
        if (res.statusText === "Created") {
            window.location.href = "http://127.0.0.1:8000/dashboard/produtos/";
        } else {
            return res.json()
        }
    }).then(function(data) {
        let divToast = document.querySelector('#toast-area');
        divToast.innerHTML = ''
        if (data.name) {
            divToast.innerHTML += `
            <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
                <div class="toast-header" style="background-color: #FA8072;">
                    <strong class="mr-auto" style="color: black;">Nome</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="color: black;">
                    ${data.name}
                </div>
            </div>
            `
        }
        if (data.price) {
            divToast.innerHTML += `
            <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
                <div class="toast-header" style="background-color: #FA8072;">
                    <strong class="mr-auto" style="color: black;">Preço</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="color: black;">
                    ${data.price}
                </div>
            </div>
            `
        }
        if (data.stock) {
            divToast.innerHTML += `
            <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
                <div class="toast-header" style="background-color: #FA8072;">
                    <strong class="mr-auto" style="color: black;">Estoque</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="color: black;">
                    ${data.stock}
                </div>
            </div>
            `
        }

        
        $('.toast').toast('show')
    })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function getProducts() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `http://127.0.0.1:8000/api/v1/products/${location.search.slice(1) ? "?" + location.search.slice(1) : window.location.href = "http://127.0.0.1:8000/dashboard/produtos/?page=1"}`)
    xhr.send()
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(JSON.parse(xhr.responseText))
            createProductList(JSON.parse(xhr.responseText));
        }
    }
}

function createProductList(products) {
    let tbody = document.querySelector('.products table tbody');
    let tbodyText = "";

    if (!products.detail) {
        products.results.map((product, i) => {
            if (i <= 12) {
                tbodyText += `
                <tr ${product.stock === 0 ? 'class="bg-warning"' : ''}>
                    <td scope="row">${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td> <i class="fas fa-edit blue" onclick="editProduct(${product.id})"></i> </td>
                    <td> <i class="far fa-trash-alt red" onclick="deleteProduct(${product.id})"></i> </td>
                </tr>
                `
            }
        })
    }
    
    tbody.innerHTML = tbodyText;
    
    if (products.links.total >= 1) {
        let divProd = document.querySelector('.products');
        let divProdText = ""
        divProdText += `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${products.links.previous == null ? "disabled" : ""} ">
                        <a class="page-link" href="${products.links.previous == null ? '#' : '?page=1' }" tabindex="-1" ${products.links.previous === null ? 'aria-disabled="true"' : ''} >&laquo;</a>
                    </li>
        `
        for(let i=1; i <= products.links.total; i++){
            divProdText += `
                <li class="page-item ${products.links.current === i ? 'active' : ''}"><a class="page-link" href="?page=${i}">${i}</a></li>
            `
        }

        divProdText += `
                <li class="page-item ${products.links.next == null ? "disabled" : ""}">
                    <a class="page-link" href="${products.links.next == null ? '' : '?page='+products.links.total}">&raquo;</a>
                </li>
            </ul>
        </nav>
        `
        divProd.innerHTML += divProdText
    }
    
        
}

function editProduct(id) {
    $.getJSON("http://127.0.0.1:8000/api/v1/products/"+id, function(data) {

        if (!("error" in data)) {
            let editModal = document.querySelector('#editModal');

            editModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Editar Produto</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                    <div class="mb-3">
                        <label for="name" class="col-form-label">Nome:</label>
                        <input type="text" class="form-control" id="name" value="${data.name}" required>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="col-form-label">Preço:</label>
                        <input type="number" min="0" max="99999" class="form-control" id="price" value="${data.price}" required>
                    </div>
                    <div class="mb-3">
                        <label for="stock" class="col-form-label">Estoque:</label>
                        <input type="number" min="0" class="form-control" id="stock" value="${data.stock}" required>
                    </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveProduct(${data.id})">Salvar</button>
                </div>
                </div>
            </div>
            `
            $('#editModal').modal('show')
        } else {
            alert(data.error)
        }
    });
}


function saveProduct(id) {
    let editModal = document.querySelector('#editModal');
    let name = editModal.querySelector('#name').value;
    let price = editModal.querySelector('#price').value;
    let stock = editModal.querySelector('#stock').value;

    let formatedPrice =  parseFloat(price);
    
    if (!formatedPrice) {
        formatedPrice = 0
    }

    if (formatedPrice < 0) {
        formatedPrice = 0
    }

    let formatedStock =  parseFloat(stock);
    
    if (!formatedStock) {
        formatedStock = 0
    }

    if (formatedStock < 0) {
        formatedStock = 0
    }

    if (price === '') { price = 0; }
    if (stock === '') { stock = 0; }

    let data = {
        name,
        price: formatedPrice,
        stock: formatedStock
    }

    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `http://127.0.0.1:8000/api/v1/products/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            mode: 'same-origin',
            body: JSON.stringify(data)
        }
    )
    fetch(request).then(res => {
        console.log(res)
        if (res.statusText === "Accepted") {
            window.location.href = "http://127.0.0.1:8000/dashboard/produtos/?page=1";
        } else {
            return res.json()
        }
    }).then(function(data) {
        let divToast = document.querySelector('#toast-area');
        divToast.innerHTML = ''
        if (data.name) {
            divToast.innerHTML += `
            <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
                <div class="toast-header" style="background-color: #FA8072;">
                    <strong class="mr-auto" style="color: black;">Nome</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="color: black;">
                    ${data.name}
                </div>
            </div>
            `
        }
        $('.toast').toast('show')
    })
}


function deleteProduct(id) {
    $.getJSON("http://127.0.0.1:8000/api/v1/products/"+id, function(data) {

        if (!("error" in data)) {
            let deleteModal = document.querySelector('#deleteModal');

            deleteModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Deletar Produto</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Você tem certeza que deseja deletar o produto ${data.name}?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="destroyProduct(${data.id})">Deletar</button>
                </div>
                </div>
            </div>
            `
            $('#deleteModal').modal('show')
        } else {
            alert(data.error)
        }
    });
}

function destroyProduct(id) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `http://127.0.0.1:8000/api/v1/products/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            mode: 'same-origin',
        }
    )

    fetch(request).then(res => {
        console.log(res)
        if (res.status === 204) {
            window.location.href = `http://127.0.0.1:8000/dashboard/produtos/?page=1`;
        }
    })
}




function registerUser(){
    var formID = document.getElementById("registerForm");
    var firstname = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var email = document.getElementById("email").value;
    var password1 = document.getElementById("password1").value;
    var cep = document.getElementById("cep").value;
    var endereco = document.getElementById("endereco").value;
    var cidade = document.getElementById("cidade").value;
    var estado = document.getElementById("estado").value;
    var numero = document.getElementById("numero").value;
    var bairro = document.getElementById("bairro").value;
    var complemento = document.getElementById("complemento").value;
    
    if (formID.checkValidity()) {
        let data = {
            "first_name": firstname,
            "last_name": last_name,
            "email": email,
            "password": password1,
            "cep": cep,
            "endereco": endereco,
            "cidade": cidade,
            "estado": estado,
            "numero": numero,
            "bairro": bairro,
            "complemento": complemento
        }
        console.log(data)
        const csrftoken = getCookie('csrftoken');
        const request = new Request(`http://127.0.0.1:8000/account/api/v1/register/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                mode: 'same-origin',
                body: JSON.stringify(data)
            }
        )
        fetch(request).then(res => {
            if (res.statusText === "Created") {
                window.location.href = "http://127.0.0.1:8000/account/login/";
                return
            } else {
                return res.json()
            }
        }).then(function(data) {
            console.log(data)
            if (data.email != 'Esse campo deve ser  único.') {
                return
            }

            if (data.email) {
                showToast("Esta e-mail já está cadastrado.")
                document.getElementById("email").focus()
                return
            }
            if (data.password) {
                showToast(data.password)
                document.getElementById("password1").focus()
                return
            }
        })


    } else {
        var firstname = document.getElementById("first_name");
        if (firstname.value == '') {
            showToast("O campo nome precisa estar preenchido.")
            firstname.focus()
            return
        }
        var lastname = document.getElementById('last_name');
        if (lastname.value == '') {
            showToast("O campo sobrenome precisa estar preenchido.")
            lastname.focus()
            return
        }
        var email = document.getElementById('email');
        if (email.value == '' || email.value.indexOf('@')==-1 || email.value.indexOf('.')== -1) {
            showToast("Informe um e-mail válido.")
            email.focus()
            return
        }
        var password1 = document.getElementById('password1');
        if (password1.value == '') {
            showToast("O campo senha precisa estar preenchido.")
            password1.focus()
            return
        }
        var password2 = document.getElementById('password2');
        if (password2.value == '') {
            showToast("O campo confirmar senha precisa estar preenchido.")
            password2.focus()
            return
        }
        if (password1.value != password2.value) {
            showToast("Os campos de senha não coincidem.")
            password2.focus()
            return
        }

        var cep = document.getElementById('cep');
        if (cep.value == '') {
            showToast("O campo CEP precisa estar preenchido.")
            cep.focus()
            return
        }
        var endereco = document.getElementById('endereco');
        if (endereco.value == '') {
            showToast("O campo endereço precisa estar preenchido.")
            endereco.focus()
            return
        }
        var cidade = document.getElementById('cidade');
        if (cidade.value == '') {
            showToast("O campo cidade precisa estar preenchido.")
            cidade.focus()
            return
        }
        var estado = document.getElementById('estado');
        if (estado.value == '') {
            showToast("O campo estado precisa estar preenchido.")
            estado.focus()
            return
        }
        var numero = document.getElementById('numero');
        if (numero.value == '') {
            showToast("O campo número precisa estar preenchido.")
            numero.focus()
            return
        }
        var bairro = document.getElementById('bairro');
        if (bairro.value == '') {
            showToast("O campo bairro precisa estar preenchido.")
            bairro.focus()
            return
        }
        var complemento = document.getElementById('complemento');
        if (complemento.value == '') {
            showToast("O campo complemento precisa estar preenchido.")
            complemento.focus()
            return
        }
        
    }
}

function showToast(msg) {
    let divToast = document.querySelector('#toast-area');
    divToast.innerHTML = ''
    divToast.innerHTML += `
        <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
            <div class="toast-header" style="background-color: #FA8072;">
                <strong class="mr-auto" style="color: black;">Informação:</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body" style="color: black;">
                ${msg}
            </div>
        </div>
    `
    $('.toast').toast('show')
}


function onlyString(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        } else if (e) {
            var charCode = e.which;
        } else {
            return true;
        }
        if (
            (charCode > 64 && charCode < 91) || 
            (charCode > 96 && charCode < 123) ||
            (charCode > 191 && charCode <= 255) // letras com acentos
        ){
            return true;
        } else {
            return false;
        }
    } catch (err) {
        alert(err.Description);
    }
}