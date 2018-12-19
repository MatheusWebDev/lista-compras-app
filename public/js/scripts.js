document.addEventListener("DOMContentLoaded", function () {
    const itens = document.querySelectorAll('.item-to-check');

    itens.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList) {
                item.classList.toggle('border');
                item.classList.toggle('border-success');
            } else {
                var classes = item.className.split(' ');
                var existingIndex = classes.indexOf('border');

                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 2);
                } else {
                    classes.push('border');
                    classes.push('border-success');
                }
                item.className = classes.join(' ');
            }
        });
    });
});
