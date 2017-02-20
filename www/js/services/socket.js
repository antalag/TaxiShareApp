app.value('messageFormatter', function (message) {
    var date=new Date(message.createdAt);
    return {hora: date.toLocaleTimeString(), from: message.from,to:message.to, message: message.message};
});