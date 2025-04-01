const appIdpagina = '1862052411210390'; 
const appIdcuenta = '1390954715416997';  
const scopepagina = 'pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,business_management'; 
const scopecuenta = 'public_profile,email,user_gender,user_location,user_link,user_posts'; 


function initFacebookSDK(appId) {
    FB.init({
        appId            : appId, 
        cookie           : true,   
        xfbml            : true,    
        version          : 'v2.5'   
    });
    console.log(`SDK inicializado con App ID: ${appId}`);
}

function loginWithAccount(appId) {
    initFacebookSDK(appId);
    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            const token = response.authResponse.accessToken;
            console.log('Token de acceso (Cuenta):', token);

            FB.api('/me/posts', function (accountData) {
                if (accountData && !accountData.error) {
                    console.log('Datos de las publicaciones:', accountData);
                    
                    if (accountData.data && accountData.data.length > 0) {
                        const firstPostId = accountData.data[0].id; // ID del primer post
                        console.log('ID del primer post:', firstPostId);

                        document.getElementById('id').innerText = `ID del primer post: ${firstPostId}`;
                    } else {
                        console.log('No se encontraron publicaciones.');
                        document.getElementById('id').innerText = 'No se encontraron publicaciones.';
                    }
                } else {
                    console.error('Error al obtener datos de las publicaciones:', accountData.error);
                    document.getElementById('id').innerText = 'Error al obtener publicaciones.';
                }
            });
        } else {
            console.log('Autenticación cancelada.');
        }
    }, { scope: scopecuenta }); 
}


function loginWithPage(appId) {
    initFacebookSDK(appId); 
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            const token = response.authResponse.accessToken;
            console.log('Token de acceso (Página):', token);

            FB.api('/me/accounts', function(pageData) {
                if (pageData && !pageData.error) {
                    console.log('Datos de las páginas administradas:', pageData.data);

                    const page = pageData.data[0]; 
                    if (page) {
                        document.getElementById('idpage').innerText = `ID de la página: ${page.id}, Nombre: ${page.name}`;
                    } else {
                        document.getElementById('idpage').innerText = 'No se encontraron páginas administradas.';
                    }
                } else {
                    console.error('Error al obtener datos de las páginas:', pageData.error);
                }
            });
        } else {
            console.log('Autenticación cancelada.');
        }
    }, { scope: scopepagina }); 
}


document.getElementById('logincuenta').addEventListener('click', () => {
    loginWithAccount(appIdcuenta);
});

document.getElementById('loginpagina').addEventListener('click', () => {
    loginWithPage(appIdpagina);
});

