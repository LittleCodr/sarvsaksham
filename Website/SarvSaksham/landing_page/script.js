var finalPath = `M 50 75 Q 750 75 1450 75`
const div = document.querySelector(".string svg");

div.addEventListener('mousemove', (event) => {
    const rect = div.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(`X: ${x}, Y: ${y}`)
    path = `M 50 75 Q ${x} ${y} 1450 75`
    gsap.to("svg path", {
        attr: { d: path },
        duration: 0.2,
        ease: "power3.out"
    })
})
div.addEventListener('mouseleave', function () {
    gsap.to("svg path", {
        attr: { d: finalPath},
        duration: 0.7,
        ease: "elastic.out(1,0.2)"
    })
})

gsap.to(".page-4 .container",{
    transform:"translateX(-60%)",
    scrollTrigger:{
        trigger:".page-4",
        markers:false,
        start:"top -5%",
        end:"top -150%",
        scrub:4,
        pin:true
    }
})