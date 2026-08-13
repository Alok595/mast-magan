fetch('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then(res => res.text()).then(html => { const match = html.match(/"lengthSeconds":"(\d+)"/); console.log(match ? match[1] : 'not found'); })
