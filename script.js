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
                nfcRegister(cartao)
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

async function nfcRegister(cartao) {

    const label = document.createElement('label')
    label.innerText = 'Qual usuário deseja vincular?'
    label.htmlFor = 'userSelect'

    const select = document.createElement('select')
    select.id = 'userSelect'

    usuarios.forEach((usuario, i) => {
        const option = document.createElement('option')
        option.value = i
        option.innerText = usuario.Nome
        select.appendChild(option)
    })

    document.body.appendChild(label)
    document.body.appendChild(select)

    select.focus()
    select.showPicker()

    select.addEventListener('change', () => {
        let usuarioEscolhido = usuarios[select.value]
        usuarioEscolhido.nfc_id = cartao
    })
}

window.nfcReader = nfcReader