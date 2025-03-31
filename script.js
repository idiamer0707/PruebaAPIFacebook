const baseURL = "https://graph.facebook.com/v22.0";
const accessToken = "EAAadhtyFZBpYBOzAEZB5iMZCAoUqmiy7zBAybSXL9IR9fThPdh7Y83vlaiJbElB0ksSRxGp7uAGBT2xqVVPqskKVEhBZA7JaZAhZBy5rNUfLAqejV162Mwzl6q3jz3OUFW9ulZCF6DIoGJxPE9exPIGweQvuWLiDv0hE8u0SgjuSe2hRWW7sJCWLzzaUHRZCFZAfqOjLuPLlSHWdBMyAZAvFM21QixTAZDZD"; 

window.fbAsyncInit = function() {
    FB.init({
        appId            : '1862052411210390', 
        xfbml            : true,
        version          : 'v22.0'
    });
};

function loginWithFacebook() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            getPagesData(); 
        } else {
            console.log('Autenticación cancelada o fallida.');
        }
    }, { scope: 'pages_show_list,business_management,pages_read_engagement,pages_read_user_content,pages_manage_posts' });
}

function getPagesData() {
    // Consulta las páginas administradas por el usuario
    FB.api('/me/accounts', function(response) {
        if (response && !response.error) {
            const pages = response.data;
            console.log('Páginas administradas:');
            
            pages.forEach(page => {
                console.log(`ID de la página: ${page.id}, Nombre: ${page.name}`);
                document.getElementById(idapp).innerText=`ID: ${page.id}, Nombre: ${page.name}`;
            });
        } else {
            console.error('Error al obtener las páginas:', response.error);
        }
    });
}

// Asocia el botón de inicio de sesión para realizar la acción
document.getElementById('loginButton').addEventListener('click', () => {
    loginWithFacebook();
});
