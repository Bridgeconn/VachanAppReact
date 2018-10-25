module.exports = {
    Keys: {
        ColorMode : 'color_mode',
        SizeMode: 'size_mode',
        VerseViewMode:'verse_view_mode',
        LastReadReference:'last_read_reference',
        LanguageCode:'language_code',
        VersionCode:'version_code',
        LanguageName:'language_name',
        VersionName:'version_name',
        BackupRestoreEmail:'backup_restore_email'

    },
    Values: {
        DayMode: 1,
        NightMode: 0,

        SizeModeXSmall: 0,
        SizeModeSmall: 1,
        SizeModeNormal: 2,
        SizeModeLarge: 3,
        SizeModeXLarge: 4,

        VerseInLine:false,

        LastReadReference: {
            languageCode:'Hin',
            versionCode:'IRV',
            bookId:'GEN',
            chapterNumber:1,
        },

        DefLanguageCode:'Hin',
        DefLanguageName:'Hindi',
        DefVersionCode:'IRV',
        DefVersionName:'Indian Revised Version'
       
    }
}



