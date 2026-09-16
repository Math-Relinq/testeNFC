import { usuarios } from "./users.js"

async function nfcReader() {
    
    let output = document.getElementById('campo')
    
    try {
        const ndef = new NDEFReader()
        await ndef.scan()

        ndef.onreading =  event => {
            let cartao = event.serialNumber

            const user = usuarios.find(u => u.nfc_id == cartao)

            if (user) {
                output.innerText = JSON.stringify(user)
            } else {
                nfcRegister(cartao, output)
            }

        }

        // ndef.onreading = event => {
        //     const id = event.serialNumber

        //     switch (String(id)) {
        //         case '04:39:fa:62:ce:2a:81':
        //             nfcField.innerText = 'Matheus'
        //             document.body.style.backgroundColor = 'blue'
        //             break;
        //         case '04:45:93:60:ce:2a:81':
        //             nfcField.innerText = 'Fabio'
        //             document.body.style.backgroundColor = 'red'
        //             break
        //         case '04:39:f1:60:ce:2a:81':
        //             nfcField.innerText = 'Casa'
        //             document.body.style.backgroundColor = 'green'
        //             break
        //         default:
        //             break;
        //     }
        // }
    } catch (err) {
        output.innerText = 'Erro: ' + err
    }
}

async function nfcRegister(cartao, output) {

    // leituras repetidas do mesmo cartao nao devem criar varios selects
    if (document.getElementById('userSelect')) return

    const label = document.createElement('label')
    label.innerText = 'Qual usuário deseja vincular?'
    label.htmlFor = 'userSelect'

    const select = document.createElement('select')
    select.id = 'userSelect'

    // placeholder para que escolher o primeiro usuario tambem dispare o 'change'
    const placeholder = document.createElement('option')
    placeholder.innerText = 'Selecione...'
    placeholder.value = ''
    placeholder.disabled = true
    placeholder.selected = true
    select.appendChild(placeholder)

    usuarios.forEach((usuario, i) => {
        const option = document.createElement('option')
        option.value = i
        option.innerText = usuario.Nome
        select.appendChild(option)
    })

    document.body.appendChild(label)
    document.body.appendChild(select)

    select.addEventListener('change', () => {
        let usuarioEscolhido = usuarios[select.value]
        usuarioEscolhido.nfc_id = cartao
        output.innerText = JSON.stringify(usuarioEscolhido)
        label.remove()
        select.remove()
    })

    select.focus()
    try {
        // showPicker() exige gesto do usuario; o evento de leitura NFC nao conta
        select.showPicker()
    } catch (err) {}
}

window.nfcReader = nfcReader