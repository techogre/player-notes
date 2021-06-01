class PlayerNote extends FormApplication {

	constructor(object, options) {
		super(object, options);

		this.entity.apps[this.appId] = this;
	}

	get entity() {
		return this.object;
	}

	get showExtraButtons() {
		return true;
	}

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.template = "modules/player-notes/templates.html";
		options.width = '600';
		options.height = '700';
		options.classes = ['player-notes', 'sheet'];
		options.title = game.i18n.localize('PlayerNote.label');
		options.resizable = true;
		options.editable = true;
		return options;
	}

	getData() {
		const data = super.getData();

		data.notes = this.entity.getFlag('player-notes', 'notes');
		data.flags = this.entity.data.flags;
		data.showExtraButtons = this.showExtraButtons;

		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);
	}
	
	async _updateObject(event, formData) {
		await this.entity.setFlag('player-notes', 'notes', formData["flags.player-notes.notes"]);
		this.render();
	}

	static _initEntityHook(app, html, data) {
		let labelTxt = '';
		let title = game.i18n.localize('PlayerNote.label'); 
		if (game.settings.get('player-notes', 'showLabel')) {
			labelTxt = ' ' + title;
		}
		let notes = app.entity.getFlag('player-notes', 'notes');
		let openBtn = $(`<a class="open-player-note" title="${title}"><i class="fas fa-clipboard${notes ? '-check':''}"></i>${labelTxt}</a>`);
		openBtn.click(ev => {
			let noteApp = null;
			for (let key in app.entity.apps) {
				let obj = app.entity.apps[key];
				if (obj instanceof PlayerNote) {
					noteApp = obj;
					break;
				}
			}
			if (!noteApp) noteApp = new PlayerNote(app.entity, { submitOnClose: true, closeOnSubmit: false, submitOnUnfocus: true });
			noteApp.render(true);
		});
		html.closest('.app').find('.open-player-note').remove();
		let titleElement = html.closest('.app').find('.window-title');
		openBtn.insertAfter(titleElement);
	}
	

}

Hooks.on('init', () => {
	game.settings.register("player-notes", 'showLabel', {
		name: game.i18n.localize('PlayerNote.setting'),
		hint: game.i18n.localize('PlayerNote.settingHint'),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
});
Hooks.on('renderActorSheet', (app, html, data) => {
	PlayerNote._initEntityHook(app, html, data);
});
Hooks.on('renderItemSheet', (app, html, data) => {
	PlayerNote._initEntityHook(app, html, data);
});
Hooks.on('renderJournalSheet', (app, html, data) => {
	PlayerNote._initEntityHook(app, html, data);
});
Hooks.on('renderRollTableConfig', (app, html, data) => {
	PlayerNote._initEntityHook(app, html, data);
});