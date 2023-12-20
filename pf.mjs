Hooks.once("init", function () {
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
        default: false
    });

    game.settings.register('fvtt-ppf', 'rootDir', {
        name: 'FVTTPPF.RootDir.Name',
        hint: 'FVTTPPF.RootDir.Hint',
        config: true, // false if you don't want it to show in module config
        type: String,
        restricted: true,
        default: ""
    });
}

function patchFilePicker() {
    FilePicker.prototype._original_browse = FilePicker.prototype.browse;
    FilePicker.prototype.browse = async function (target, options={}) {
        if (!game.user.isGM && game.settings.get('fvtt-ppf', 'enabled')) {
            const userDir = game.settings.get('fvtt-ppf', 'rootDir');
            if (!target || !target.startsWith(userDir)) {
                target = userDir
            }
        }
        return await this._original_browse(target, options)
    }
}