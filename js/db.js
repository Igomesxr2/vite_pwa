import { openDB } from "idb";
let db;
async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message)
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("input");
    document.getElementById("btnSalvar").addEventListener("click", addData);
    document.getElementById("bntListar").addEventListener("click", getData);
    document.getElementById("bntBuscar").addEventListener("click", buscarData);
    
});

async function addData() {
    let nome = document.getElementById("nome").value
    let idade = document.getElementById("idade").value
    console.log(nome, idade)
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({ nome: nome, idade: idade });
    await tx.done;
    showResult("Pessoa salva com sucesso!");
    document.getElementById("nome").value = '';
    document.getElementById("idade").value = '';
}
async function getData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }
    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const value = await store.getAll();
    if (value) {
        const listagem = value.map(pessoa => {
            return `<div>
            <p> ${pessoa.nome}</p>
            <p> ${pessoa.idade}</p>
            </div>`
        })
        showResult ("Dados do banco:" + listagem.join(''))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}

async function buscarData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }
    let nome = document.getElementById("buscar").value
    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const objetoBuscado = await store.get(nome);
    if (objetoBuscado) {
        document.getElementById("nome").value = objetoBuscado.nome;
        document.getElementById("idade").value = objetoBuscado.idade;
        showResult ("Dados do banco:" + listagem.join(''))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}

async function atualizarData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }
    let nome = document.getElementById("buscar").value
    const tx = await db.transaction('pessoas', 'readwrite')
    const store = tx.objectStore('pessoas');
    const objetoBuscado = await store.get(nome);
    if (objetoBuscado) {
        document.getElementById("nome").value = objetoBuscado.nome;
        document.getElementById("idade").value = objetoBuscado.idade;
        showResult ("Dados do banco:" + listagem.join(''))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}


function showResult(text) {
    document.querySelector("output").innerHTML = text;
}