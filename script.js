const appIdpagina = '1862052411210390'; 
const appIdcuenta = '1390954715416997';  
const scopepagina = 'pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,business_management'; 
const scopecuenta = 'public_profile,email,user_gender,user_location,user_link'; 

function initFacebookSDK(appId) {
    FB.init({
        appId            : appId, 
        cookie           : true,   
        xfbml            : true,    
        version          : 'v22.0'   
    });
    console.log(`SDK inicializado con App ID: ${appId}`);
}

function loginWithAccount(appId) {
    initFacebookSDK(appId); 
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            const token = response.authResponse.accessToken;
            console.log('Token de acceso (Cuenta):', token);

            FB.api('/me?fields=id,name', function(accountData) {
                if (accountData && !accountData.error) {
                    console.log('Datos de la cuenta:', accountData);
                    document.getElementById('nombre').innerText = `Nombre: ${accountData.name}`;
                    document.getElementById('id').innerText = `ID: ${accountData.id}`;
                } else {
                    console.error('Error al obtener datos de la cuenta:', accountData.error);
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
            console.log('Token de acceso (Usuario):', token);

            FB.api('/me/accounts?fields=access_token,followers_count', function(pageData) {
                if (pageData && !pageData.error) {
                    console.log('Datos de las páginas administradas:', pageData.data);
                    const page = pageData.data[0]; 
                    if (page) {
                        
                        const pageToken = page.access_token; 
                        const followers = page.followers_count;
                        const pageId = page.id;

                        document.getElementById('followers').innerText = `Número de seguidores: ${followers}`;
                        document.getElementById('pageid').innerText = `ID de la página: ${pageId}`;

                        FB.api(`/${pageId}/posts?fields=comments.summary(total_count),reactions.summary(total_count)&access_token=${pageToken}`, function(postList) {
                            if (postList && !postList.error) {
                                console.log('Lista de posts recibidas:', postList.data);

                                let totalLikes = 0;
                                let totalComments = 0;

                                postList.data.forEach(post => {
                                    const likes = post.reactions ? post.reactions.summary.total_count : 0;
                                    const comments = post.comments ? post.comments.summary.total_count : 0;

                                    totalLikes += likes;
                                    totalComments += comments;

                                    console.log(`Post ID: ${post.id}`);
                                    console.log(`Likes: ${likes}`);
                                    console.log(`Comentarios: ${comments}`);
                                });

                                document.getElementById('likes').innerText = `Total de Likes: ${totalLikes}`;
                                document.getElementById('coments').innerText = `Total de Comentarios: ${totalComments}`;
                            } else {
                                console.error('Error al recibir la lista de posts:', postList.error);
                            }
                        });
                    } else {
                        document.getElementById('pageid').innerText = 'No se encontraron páginas administradas.';
                    }
                } else {
                    console.error('Error al obtener datos de las páginas:', pageData.error);
                }
            });
        } else {
            console.log('Autenticación cancelada.');
        }
    }, { scope: 'pages_read_engagement,pages_read_user_content' });
}

document.getElementById('logincuenta').addEventListener('click', () => {
    loginWithAccount(appIdcuenta);
});

document.getElementById('loginpagina').addEventListener('click', () => {
    loginWithPage(appIdpagina);
});
