const appIdpagina = '1862052411210390'; 
const scopepagina = 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,business_management,instagram_basic,instagram_manage_comments,instagram_manage_insights'; 

function initFacebookSDK(appId) {
    FB.init({
        appId            : appId, 
        cookie           : true,   
        xfbml            : true,    
        version          : 'v22.0'   
    });
    console.log(`SDK inicializado con App ID: ${appId}`);
}

async function loginWithPage(appId) {
    initFacebookSDK(appId); 

    FB.login(async function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            const token = response.authResponse.accessToken;
            console.log('Token de acceso (Usuario):', token);

            try {
                const accountData = await new Promise((resolve, reject) => {
                    FB.api('/me?fields=id,name', function(data) {
                        if (data && !data.error) resolve(data);
                        else reject(data.error);
                    });
                });

                console.log('Datos de la cuenta:', accountData);
                document.getElementById('nombre').innerText = `Nombre: ${accountData.name}`;
                document.getElementById('id').innerText = `ID: ${accountData.id}`;

                const pageData = await new Promise((resolve, reject) => {
                    FB.api('/me/accounts?fields=access_token,followers_count,instagram_business_account', function(data) {
                        if (data && !data.error) resolve(data.data[0]);
                        else reject(data.error);
                    });
                });
                if (pageData && pageData.instagram_business_account) {
                    
                    const followers = pageData.followers_count;
                    const pageId = pageData.id;
                    const instaId = pageData.instagram_business_account.id;

                    document.getElementById('followers').innerText = `Número de seguidores: ${followers}`;
                    document.getElementById('pageid').innerText = `ID de la página: ${pageId}`;

                    const instaData = await new Promise((resolve, reject) => {
                        FB.api(`/${instaId}?fields=followers_count,media_count,username`, function(data) {
                            if (data && !data.error) resolve(data);
                            else reject(data.error);
                        });
                    });

                    const followersInta = instaData.followers_count;
                    const userInsta = instaData.username;

                    console.log(`Seguidores de Instagram: ${followersInta}`);
                    document.getElementById('followersInta').innerText = `Número de seguidores: ${followersInta}`;
                    document.getElementById('idInsta').innerText = `ID de la cuenta de Instagram: ${instaId}`;
                    document.getElementById('userInsta').innerText = `Usuario de la cuenta de Instagram: ${userInsta}`;

                    const mediaList = await new Promise((resolve, reject) => {
                        FB.api(`/${instaId}/media`, function(data) {
                            if (data && !data.error) resolve(data);
                            else reject(data.error);
                        });
                    });

                    if (mediaList && mediaList.data.length > 0) {
                        console.log('Lista de posts recibida:', mediaList.data);

                        let totalLikesI = 0;
                        let totalCommentsI = 0;

                        for (const post of mediaList.data) {
                            console.log(`Post ID: ${post.id}`);

                            const postData = await new Promise((resolve, reject) => {
                                FB.api(`/${post.id}?fields=like_count,comments_count`, function(data) {
                                    if (data && !data.error) resolve(data);
                                    else reject(data.error);
                                });
                            });

                            totalLikesI += postData.like_count || 0;
                            totalCommentsI += postData.comments_count || 0;
                        }

                        document.getElementById('likesInsta').innerText = `Total de Likes: ${totalLikesI}`;
                        document.getElementById('coments').innerText = `Total de Comentarios: ${totalCommentsI}`;
                    } else {
                        console.error('Error al recibir la lista de posts.');
                    }
                } else {
                    console.error('No hay cuenta de Instagram asociada.');
                }

                FB.api(`/${pageData.id}/posts?fields=comments.summary(total_count),reactions.summary(total_count)&access_token=${pageData.access_token}`, function(postList) {
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
            } catch (error) {
                console.error(`Error en la solicitud: ${error.message}`);
            }
        } else {
            console.log('Autenticación cancelada.');
        }
    }, { scope: scopepagina });
}

const loginButton = document.getElementById('loginpagina');
if (loginButton) {
    loginButton.addEventListener('click', () => {
        loginWithPage(appIdpagina);
    });
} else {
    console.error('Botón de login no encontrado en el DOM.');
}
