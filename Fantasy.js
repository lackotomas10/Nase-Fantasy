function ExpandStats(){
    const expanded = document.getElementById("StatsExtend").classList.toggle("is-expanded")
    document.getElementById("ExpImg").src = expanded
        ? "img/svgikony/ŠipkaN.svg"
        : "img/svgikony/ŠipkaD.svg"
}