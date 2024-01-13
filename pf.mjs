Hooks.once("setup", function () {
    registerSettings();
    patchFilePicker();
});

function registerSettings() {
    game.settings.register('fvtt-ppf', 'enabled', {
        name: 'FVTTPPF.Enabled.Name',
        hint: 'FVTTPPF.Enabled.Hint',
        config: true, // false if you don't want it to show in module config
        type: Boolean,
        restricted: true,
        requiresReload: true,
        default: false
    });

    game.settings.register('fvtt-ppf', 'rootDir', {
        name: 'FVTTPPF.RootDir.Name',
        hint: 'FVTTPPF.RootDir.Hint',
        config: true, // false if you don't want it to show in module config
        type: String,
        restricted: true,
        requiresReload: true,
        default: "user_data"
    });
}

async function patchFilePicker() {
    if (!game.settings.get('fvtt-ppf', 'enabled')) return;
    const userDir = game.settings.get('fvtt-ppf', 'rootDir');
    if (game.user.isGM) {
        for (const u of game.users) {
            const target = userDir + "/" + u.name;
            try { await FilePicker.createDirectory("data", userDir) } catch (e) {}
            try { await FilePicker.createDirectory("data", target) } catch (e) {}
        }
    }

    FilePicker.prototype._original_browse = FilePicker.prototype.browse;
    FilePicker.prototype.browse = async function (target, options={}) {
        if (!game.user.isGM) {
            const personalDir = userDir+ "/" + game.user.name;
            if (!target || !target.startsWith(personalDir)) {
                target = personalDir
            }
        }
        return await this._original_browse(target, options)
    }
}