import { UPDATE_VERSION , SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE} from "./actionsType";

export const updateVersion = (language,version,sourceId,downloaded)=>{
    return {
        type:UPDATE_VERSION,
        language:language,
        version:version,
        sourceId:sourceId,
        downloaded:downloaded
    }
}

export const selectedBook = (bookId,bookName,totalChapters)=>{
    return {
        type:SELECTED_BOOK,
        bookId:bookId,
        bookName:bookName,
        totalChapters:totalChapters,
    }
}
export const selectedChapter = (chapterNumber,totalVerses)=>{
    return {
        type:SELECTED_CHAPTER,
        chapterNumber:chapterNumber,
        totalVerses:totalVerses,
    }
}

export const selectedVerse = (verseNumber)=>{
    return {
        type:SELECTED_VERSE,
        verseNumber:verseNumber,
    }
}
