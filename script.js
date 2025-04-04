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

function loginWithPage(appId) {
    initFacebookSDK(appId); 

    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado correctamente:', response);
            const token = response.authResponse.accessToken;
            console.log('Token de acceso (Usuario):', token);

            
            FB.api('/me?fields=id,name', function(accountData) {
                if (accountData && !accountData.error) {
                    console.log('Datos de la cuenta:', accountData);
                    document.getElementById('nombre').innerText = `Nombre: ${accountData.name}`;
                    document.getElementById('id').innerText = `ID: ${accountData.id}`;
                } else {
                    console.error('Error al obtener datos de la cuenta:', accountData.error);
                }
            });

            
            FB.api('/me/accounts?fields=access_token,followers_count,instagram_business_account', function(pageData) {
                if (pageData && !pageData.error) {
                    console.log('Datos de las páginas administradas:', pageData.data);
                    const page = pageData.data[0]; 

                    if (page) {
                        const pageToken = page.access_token; 
                        const followers = page.followers_count;
                        const pageId = page.id;
                        const instaId = page.instagram_business_account.id;
                        console.log(`: ${followersInta}`);

                        document.getElementById('followers').innerText = `Número de seguidores: ${followers}`;
                        document.getElementById('pageid').innerText = `ID de la página: ${pageId}`;

                        
                        FB.api(`/${instaId}?fields=followers_count,media_count,username`, function(instaData) {
                            if (instaData && !instaData.error) {
                                const followersInta = instaData.followers_count;
                                const userInsta = instaData.username;

                                console.log(`Seguidores de Instagram: ${followersInta}`);
                                document.getElementById('followersInta').innerText = `Número de seguidores: ${followersInta}`;
                                document.getElementById('idInsta').innerText = `ID de la cuenta de Instagram: ${instaId}`;
                                document.getElementById('userInsta').innerText = `Usuario de Instagram: ${userInsta}`;

                                
                                FB.api(`/${instaId}/media`, function(mediaList) {
                                    if (mediaList && !mediaList.error && mediaList.data.length > 0) {
                                        console.log('Lista de posts recibida instagram:', mediaList.data);

                                        let totalLikesI = 0;
                                        let totalCommentsI = 0;
                                        let totalvistasI = 0;

                                        const promises = mediaList.data.map(post => {
                                            return new Promise((resolve, reject) => {
                                                FB.api(`/${post.id}/insights?metric=likes,comments,views`, function(insights) {
                                                    if (insights && !insights.error && insights.data.length > 0) {
                                                        const likes = insights.data[0].values[0].value;
                                                        const comments = insights.data[1].values[0].value;
                                                        const vistas = insights.data[2].values[0].value;
                                                        console.log(`Likes del post de insta: ${likes}`);
                                                        console.log(`Comentarios del post de insta: ${comments}`);
                                                        console.log(`vistas del post de insta: ${vistas}`);
                                                        totalLikesI += likes;
                                                        totalCommentsI += comments;
                                                        totalvistasI += vistas
                                                        resolve(); 
                                                    } else {
                                                        console.error('Error al obtener datos del post:', insights.error);
                                                        reject(insights.error);  
                                                    }
                                                });
                                            });
                                        });
                                        
                                        Promise.all(promises).then(() => {
                                            document.getElementById('likesInsta').innerText = `Total de Likes: ${totalLikesI}`;
                                            document.getElementById('comentsInsta').innerText = `Total de Comentarios: ${totalCommentsI}`;
                                            document.getElementById('vistasInsta').innerText = `Total de vistas: ${totalvistasI}`;
                                        }).catch(error => {
                                            console.error('Error en la obtención de datos:', error);
                                        });

                                    } else {
                                        console.error('Error al recibir la lista de posts:', mediaList.error);
                                    }
                                });
                            } else {
                                console.error('Error al obtener datos de Instagram:', instaData.error);
                            }
                        });

                        
                        FB.api(`/${pageId}/posts?fields=comments.summary(total_count),reactions.summary(total_count)&access_token=${pageToken}`, function(postList) {
                            if (postList && !postList.error) {
                                console.log('Lista de posts recibida de facebook:', postList.data);

                                let totalLikes = 0;
                                let totalComments = 0;
                                let totalImpresion = 0;

                                postList.data.forEach(post => {
                                    const likes = post.reactions ? post.reactions.summary.total_count : 0;
                                    const comments = post.comments ? post.comments.summary.total_count : 0;

                                    totalLikes += likes;
                                    totalComments += comments;

                                    console.log(`Post ID: ${post.id}`);
                                    console.log(`Likes: ${likes}`);
                                    console.log(`Comentarios: ${comments}`);

                                    FB.api(`/${post.id}/insights?metric=post_impressions&access_token=${pageToken}`, function(insights) {
                                        if (insights && !insights.error && insights.data.length > 0) {
                                            const impressions = insights.data[0].values[0].value;
                                            console.log(`Impresiones para el post ${post.id}: ${impressions}`);
                                            totalImpresion += impressions;
                                        } else {
                                            console.error('Error al obtener datos de impresiones:', insights.error);
                                        }
                                    });
                                });

                                document.getElementById('impresions').innerText = totalImpresion > 0 
                                    ? `Total de impresiones: ${totalImpresion}`
                                    : `No hay suficiente impacto para ver impresiones`;
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

document.getElementById('loginpagina').addEventListener('click', () => {
    loginWithPage(appIdpagina);
});
