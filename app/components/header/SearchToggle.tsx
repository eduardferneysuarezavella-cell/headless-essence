import { Drawer, useDrawer } from "../Drawer";
import { SearchTypeDrawer } from "../predictive-search/drawer/search-type-drawer";

export function SearchToggle() {
    const { isOpen, closeDrawer, openDrawer } = useDrawer();

    return (
        <>
            <button
                type="button"
                className="relative inline-block align-middle"
                onClick={openDrawer}
            >
                <svg className="relative inline-block align-middle" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m14.37 12.86 5.636 5.637-1.414 1.414-5.633-5.632a7.627 7.627 0 0 1-4.688 1.604c-4.256 0-7.707-3.483-7.707-7.78 0-4.297 3.45-7.78 7.707-7.78s7.707 3.483 7.707 7.78c0 1.792-.6 3.442-1.608 4.758ZM8.27 14.084c3.259 0 5.907-2.673 5.907-5.98 0-3.306-2.648-5.98-5.907-5.98-3.258 0-5.907 2.674-5.907 5.98 0 3.307 2.649 5.98 5.907 5.98Z" fill="#000" fillRule="nonzero"></path>
                </svg>
            </button>

            <Drawer
                open={isOpen}
                onClose={closeDrawer}
                openFrom="top"
                heading="Sök"
            >
                <SearchTypeDrawer isOpen={isOpen}/>
            </Drawer>
        </>
    )
}