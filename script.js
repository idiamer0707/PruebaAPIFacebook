// Configuración del botón de inicio de sesión
document.getElementById('loginButton').addEventListener('click', () => {
    const appId = '1862052411210390'; 
    const redirectUri = 'https://idiamer0707.github.io/PruebaAPIFacebook/'; 
    const scope = 'pages_show_list,business_management,pages_read_engagement,pages_read_user_content,pages_manage_posts';

   
    const authUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

    
    window.location.href = authUrl;
});

window.onload = function() {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
        console.log('Token de acceso:', token);
        getPagesData(token); 
    } else {
        console.error('No se obtuvo el token de acceso.');
    }
};

// Consulta las páginas administradas
function getPagesData(accessToken) {
    const url = `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && !data.error) {
                const pages = data.data;
                console.log('Páginas administradas:');

                const output = document.getElementById('idapp');
                output.innerHTML = ''; 
                pages.forEach(page => {
                    const pageInfo = `ID: ${page.id}, Nombre: ${page.name}`;
                    output.innerHTML += `${pageInfo}<br>`;
                });
            } else {
                console.error('Error al obtener las páginas:', data.error);
            }
        })
        .catch(error => console.error('Error en la solicitud:', error));
}
