const QBCore = exports["qb-core"].GetCoreObject()

onNet("mb-contribution:server:HandleDonateMoney", (data) => {
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    const bank = Player.PlayerData.money["bank"]
    const fullName = Player.PlayerData.charinfo.firstname + ' ' + Player.PlayerData.charinfo.lastname
    const cid = Player.PlayerData.citizenid

    if (bank >= data && bank > 0) {
        Player.Functions.RemoveMoney("bank", data)

        global.exports['oxmysql'].execute('INSERT INTO Contribution (citizenid, user, totalMoney) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE totalMoney = totalMoney + ?',
            [cid, fullName, data, data], (result) => {
                console.log(result);
            });

        emitNet("mb-contribution:client:UpdateUIMoney", -1)
    } else {
        emitNet("QBCore:Notify", src, Config.Locale.noMoney, "error")
    }
})

QBCore.Functions.CreateCallback('mb-contribution:server:getPersonalDonated', (source, cb, citizenid) => {
    global.exports['oxmysql'].execute('SELECT totalMoney FROM Contribution WHERE citizenid = ?',
        [citizenid], (result) => {
            const personalDonated = result[0] ? result[0].totalMoney : 0;
            cb(personalDonated);
        });
});

QBCore.Functions.CreateCallback('mb-contribution:server:getTotalDonated', (source, cb) => {
    global.exports['oxmysql'].execute('SELECT SUM(totalMoney) AS totalDonated FROM Contribution', [], (result) => {
        const totalDonated = result[0] ? result[0].totalDonated : 0;
        cb(totalDonated);
    });
});

QBCore.Functions.CreateCallback('mb-contribution:server:getTopContributor', (source, cb) => {
    global.exports['oxmysql'].execute('SELECT user, totalMoney FROM Contribution ORDER BY totalMoney DESC LIMIT 10', [], (result) => {
        cb(result);
    });
});


