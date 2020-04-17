function remove_gist(id) {
    if (confirm("真的要删除吗？本操作无法恢复")) {
        location = '/gists/remove/' + id;
    } else {
        console.log('删除取消');
    }
}