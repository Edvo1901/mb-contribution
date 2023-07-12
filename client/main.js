const QBCore = exports['qb-core'].GetCoreObject()
let pedSpawn = false
let ped

const Wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const createPed = async () => {
    if (pedSpawn) return;

    const model = GetHashKey(Config.PedModel);
    const [x, y, z, h] = Config.PedCoord;

    if (!HasModelLoaded(model)) {
        RequestModel(model);
        await Wait(100);
    }
    while (!HasModelLoaded(model)) {
        await Wait(0);
    }
    ped = CreatePed("PED_TYPE_CIVMALE", model, x, y, z-1, h, false, true);
    SetEntityHeading(ped, h);
    FreezeEntityPosition(ped, true);
    SetEntityInvincible(ped, true);
    SetBlockingOfNonTemporaryEvents(ped, true);
    global.exports['qb-target'].AddTargetEntity(ped, {
        options: [
            {
                type: "client",
                event: "mb-contribution:client:SetUpForm",
                icon: 'fas fa-donate',
                label: Config.Locale.donate,
            }
        ],
        distance: 2.5,
    });

    setTimeout(() => {
        pedSpawn = true;
    }, 500)
}

const deleteContributePed = () => {
    if (!pedSpawn) return;
    DeletePed(ped);
    pedSpawn = false;
}

const createBlips = () => {
    const [x, y, z] = Config.PedCoord;
    let blip = AddBlipForCoord(x, y, z);
    SetBlipSprite(blip, Config.Blips.sprite); // Set the icon for the blip. 615 is the dollar sign icon. Change this to a different number for a different icon.
    SetBlipScale(blip, Config.Blips.scale); // Set the size of the blip
    SetBlipColour(blip, Config.Blips.color); // Set the color of the blip. 2 is green. Change this to a different number for a different color.
    SetBlipAsShortRange(blip, true); // Set the blip to only display when it's near the player
    BeginTextCommandSetBlipName("STRING");
    AddTextComponentString(Config.Blips.name); // Set the text that displays when the player hovers over the blip on the map.
    EndTextCommandSetBlipName(blip);
}

const getPersonalDonated = (cid) => {
    return new Promise((resolve, reject) => {
        QBCore.Functions.TriggerCallback('mb-contribution:server:getPersonalDonated', (donated) => {
            resolve(donated)
        }, cid);
    });
};

const getTotalMoney = () => {
    return new Promise((resolve, reject) => {
        QBCore.Functions.TriggerCallback('mb-contribution:server:getTotalDonated', (money) => {
            resolve(money)
        });
    });
};

const getTopContributor = () => {
    return new Promise((resolve, reject) => {
        QBCore.Functions.TriggerCallback('mb-contribution:server:getTopContributor', (contributors) => {
            resolve(contributors)
        });
    });
};

onNet("QBCore:Client:OnPlayerLoaded", async () => {
    await createPed();
    createBlips();
})

onNet("QBCore:Client:OnPlayerUnload", () => {
    deleteContributePed();
})

on("onResourceStart", async (resourceName) => {
    if (GetCurrentResourceName() != resourceName) return;

    while (!QBCore) {
        await Wait(1000);
    }

    await createPed()
    createBlips()
})

on("onResourceStop", async (resourceName) => {
    if (GetCurrentResourceName() != resourceName) return;

    deleteContributePed()
})

on('mb-contribution:client:openUI', (data) => {
    Promise.all([getPersonalDonated(data.citizenid), getTotalMoney(), getTopContributor()])
        .then(([donated, money, top]) => {
            let personalDonated = donated
            let totalMoney = money
            let contributors = top

            SetNuiFocus(true, true)
            SendNUIMessage({
                action: 'open',
                name: data.charinfo.firstname + ' ' + data.charinfo.lastname,
                money: data.money.bank,
                personalDonated: personalDonated,
                totalDonation: totalMoney,
                contributors: contributors
            })
        })
        .catch((error) => {
            console.error(error);
        });
})

RegisterNuiCallback('close', () => {
    SendNUIMessage({
        action: 'close',
    })
    SetNuiFocus(false, false)
})

RegisterNuiCallback('donateMoney', (value) => {
    emitNet("mb-contribution:server:HandleDonateMoney", value.money)
})

on("mb-contribution:client:SetUpForm", () => {
    let PlayerData = QBCore.Functions.GetPlayerData()
    emit('mb-contribution:client:openUI', PlayerData)
})

onNet("mb-contribution:client:UpdateUIMoney", () => {
    let PlayerData = QBCore.Functions.GetPlayerData()
    Promise.all([getPersonalDonated(PlayerData.citizenid), getTotalMoney(), getTopContributor()])
    .then(([donated, money, top]) => {
        let personalDonated = donated;
        let totalMoney = money;
        let contributors = top
        SendNUIMessage({
            action: 'updateMoney',
            money: PlayerData.money.bank,
            personalDonated: personalDonated,
            totalDonation: totalMoney,
            contributors: contributors
        })
    })
    .catch((error) => {
        console.error(error);
    });
})