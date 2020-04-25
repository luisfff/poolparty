module.exports = async function (context, req, preferenceTable) {

    if (!preferenceTable) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: JSON.stringify({
                found:false
            })
        };
    }
    else {
        context.res = {
            body: JSON.stringify({
                found:true,
                data: preferenceTable.bathers
            })
        };
    }
};