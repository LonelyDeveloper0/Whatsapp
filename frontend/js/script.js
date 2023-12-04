// LOGIN
const login = document.querySelector('.login')
const loginForm = login.querySelector('.loginForm')
const loginInput = login.querySelector('.loginInput')

// CHAT
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chatForm')
const chatInput = chat.querySelector('.chatInput')
const chatMessages = chat.querySelector('.chatMessages')

const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]

const user = { id: '', name: '', color: '' }

let webSocket

const createSelfMessage = (content) => {
    const div = document.createElement('div')

    div.classList.add('messageSelf')
    div.innerHTML = content

    return div
}

const createOtherMessage = (content, userName, userColor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('messageOther')
    div.classList.add('messageSelf')
    span.classList.add('messageSender')
    span.style.color = userColor

    div.appendChild(span)

    span.innerHTML = userName
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * colors.length)
    return colors[randomColor]
}

const processMessages = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const element = userId == user.id ? createSelfMessage(content) : createOtherMessage(content, userName, userColor)

    chatMessages.appendChild(element)
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    webSocket = new WebSocket('ws://localhost:8080')
    webSocket.onmessage = processMessages

    console.log(user)
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    webSocket.send(JSON.stringify(message))

    chatInput.value = ''
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)