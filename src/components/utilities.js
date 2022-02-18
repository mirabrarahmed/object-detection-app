export const drawRect = (results, ctx) => {
    results.forEach(result => {
        const [x,y,width,height] = result['bbox']
        const text = result['class']

        const color = '#eb4034'
        ctx.strokeStyle = color
        ctx.font = '18px Arial'
        ctx.fillStyle = color

        ctx.beginPath()
        ctx.fillText(text, x, y)
        ctx.rect(x, y, width, height)
        ctx.stroke()
    })
}