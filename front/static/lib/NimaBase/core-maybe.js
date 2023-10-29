export const render = () => {

    if (this.state.error) {
        return o.default.createElement(UnhandledError.default, { // react
            error: this.state.error,
        });
    }

    // each state.contextMenus as menu, i
    // <ContextMenu key={"cx" + i} data={menu} on:hide={removeContextMenu} />
    for (
        var renderedContextMenus = [], t = 0;
        t < this.state.contextMenus.length;
        t++
    ) {
        var n = this.state.contextMenus[t];
        renderedContextMenus.push(
        o.default.createElement(ContextMenu.default, { // react
            key: "cx" + t,
            data: n,
            onHide: this.removeContextMenu,
        })
        );
    }

    var exportScreen = null;
    if (this.state.showExportToEngine)
        switch (this.exporter) {
        case ProjectExportScreen.default:
            exportScreen = o.default.createElement(ProjectExportScreen.default, { // react
                ref: this.setExportScreen,
                onExportComplete: this.toggleShowExport,
            });
            break;
        case ToEngineExportScreen.default:
            exportScreen = o.default.createElement(ToEngineExportScreen.default, { // react
                ref: this.setExportScreen,
                onExportComplete: this.toggleShowExport,
            });
            break;
        case ImageSeqExportScreen.default:
            exportScreen = o.default.createElement(ImageSeqExportScreen.default, { // react
                ref: this.setExportScreen,
                onExportComplete: this.toggleShowExport,
            });
            break;
        case ShotExportScreen.default:
            exportScreen = o.default.createElement(ShotExportScreen.default, { // react
                ref: this.setExportScreen,
                username: this.props.user.username,
                verified: this.props.isVerified,
                name: this.props.user.name,
                avatar: this.props.user.avatar,
                onExportComplete: this.toggleShowExport,
            });
        }
    var r = this.props.file;
    /*
    <div class="UIPanels">
        {:if isFilesModalOpen || isFilesModalClosing}
            <FilesModal ... />
        {/if}

        {:if isPropertiesModalOpen || isPropertiesModalClosing}
            <PropertiesModal ... />
        {/if}

        {:if showCrashError}
            <CrashError ... />
        {/if}

        {:if showBrowserWarning}
            <BrowserWarning ... />
        {/if}

        <SiteMenu class="SiteMenuWrapper" ... />
        <HierarchyPanel id="HierarchyPanel" ... />
        <ResizeGrabber class="HierarchyResizer" ... />
        <ResizeGrabber class="SelectionResizer" ... />
        <SelectionPanel id="SelectionPanel" ... />

        <div class="StagePanel">
            <AlertContainer />
            <GuideRuler class="TopGuideRuler" />
            <GuideRuler class="TopGuideRulerTicks" />
        </div>

        <AnimationPanel class="AnimationPanel" />
        <Toolbar id="Toolbar" />
        <SettingsPanel id="SettingsPanel" />

        <svelte:component this={exportScreen} />        <!-- <div class="ModalWrapper ExportModal">...</div> -->

        <Tooltip class="Tooltip" />

        {#each renderedContextMenus as rcx}             <!-- <div class="RightClickMenu" style="left: 441px; top: 881px;"> ... </div> -->
            <svelte:component this={rcx} />
        {/each}

        <div ref={this.setDropdownPopupsDiv} />
    </div>

    */
    return o.default.createElement( // react
        "div",
        {
            className: "UIPanels",
        },
        this.state.isFilesModalOpen ||
        this.state.isFilesModalClosing
        ? o.default.createElement(FilesModal.default, { // react
            key: "files",
            defaultFilename: r.title,
            onChooseLocation: this.state.chooseLocation,
            path: this.state.filesModalPath,
            isOpen: this.state.isFilesModalOpen,
            isClosing: this.state.isFilesModalClosing,
            onClose: this.closeFilesModal,
            })
        : null,

        this.state.isPropertiesModalOpen ||
        this.state.isPropertiesModalClosing
        ? o.default.createElement(PropertiesModal.default, { // react
            isOpen: this.state.isPropertiesModalOpen,
            isClosing: this.state.isPropertiesModalClosing,
            onClose: this.closePropertiesModal,
            file: r,
            })
        : null,

        this.state.showCrashError
        ? o.default.createElement(CrashError.default, null) // react
        : null,

        this.state.showBrowserWarning
        ? o.default.createElement(BrowserWarning.default, { // react
            onContinueAnyway:
                this.continueUsingUnoptimizedBrowser,
            })
        : null,

        o.default.createElement(SiteMenu.default, { // react
            ref: this.setMenu,
            onClose: this.toggleSiteMenu,
            onShowFilesModal: this.showFilesModal,
            onLogoClick: this.logoClick,
            file: r,
            siteMenuOpen: this.state.siteMenuOpen,
            username: this.props.user.username,
            name: this.props.user.name,
            avatar: this.props.user.avatar,
        }),

        o.default.createElement(HierarchyPanel.default, { // react
            ref: this.setFilePanel,
            onShowPropertiesModal: this.showPropertiesModal,
            onLogoHover: this.loadMenu,
            onLogoClick: this.logoClick,
            siteMenuOpen: this.state.siteMenuOpen,
            file: r,
            profileName: this.props.user.name,
            onSwitchedToggle: this.switchWorkspace,
            width: this.filePanelWidth,
            selectionPanelWidth: this.selectionPanelWidth,
            onHierarchyPanelsResized: this.onHierarchyPanelsResized,
        }),
        o.default.createElement(ResizeGrabber.default, { // react
            ref: this.setFilePanelResizer,
            onMouseDown: this.startResizeFilePanel,
            addClass: "HierarchyResizer",
        }),
        o.default.createElement(ResizeGrabber.default, { // react
            ref: this.setSelectionResizer,
            onMouseDown: this.startResizeSelection,
            addClass: "SelectionResizer",
        }),
        o.default.createElement(SelectionPanel.default, { // react
            ref: this.setSelectionPanel,
            filePanelWidth: this.filePanelWidth,
            width: this.selectionPanelWidth,
            animationPanelHeight: this.animationPanelHeight,
            animationIsResizing: this.state.animationIsResizing,
            onMeshMode: this.meshMode,
            onWeightsMode: this.weightsMode,
        }),

        o.default.createElement( // react
            "div",
            {
                ref: this.setStagePanel,
                className: "StagePanel",
            },
            o.default.createElement(AlertContainer.default, { // react
                ref: this.setAlertContainer,
                showGuides: this.state.showGuides,
                showModal: this.hasModalOpen,
            }),

            o.default.createElement(GuideRuler.default, { // react
                ref: this.setVerticalRuler,
                isVertical: false,
                isVisible:
                !this.state.isShowingExport &&
                !this.state.showExportToEngine &&
                this.state.showGuides,
            }),

            o.default.createElement(GuideRuler.default, { // react
                ref: this.setHorizontalRuler,
                isVertical: true,
                isVisible:
                !this.state.isShowingExport &&
                !this.state.showExportToEngine &&
                this.state.showGuides,
            })

        ),
        o.default.createElement(AnimationPanel.default, { // react
            ref: this.setAnimationPanel,
            onClickResizeGrabber: this.startResizeAnimation,
            height: this.animationPanelHeight,
            actor: this.state.actor,
            onAnimationSelected: this.selectAnimation,
            onDeleteAnimation: this.deleteAnimation,
            settingsOpen: this.state.settingsOpen,
            filePanelWidth: this.filePanelWidth,
        }),

        o.default.createElement(Toolbar.default, { // react
            ref: this.setToolbar,
            onSettingsToggled: this.settingsToggled,
            onGotoExport: this.showExportMenu,
            settingsOpen: this.state.settingsOpen,
        }),

        o.default.createElement(SettingsPanel.default, { // react
            ref: this.setSettingsPanel,
            onSettingsToggled: this.settingsToggled,
            isOpen: this.state.settingsOpen,
        }),

        exportScreen,

        o.default.createElement(Tooltip.default, { // react
            ref: this.setTooltip,
        }),

        renderedContextMenus,

        o.default.createElement("div", { // react
            ref: this.setDropdownPopupsDiv,
        })
    );
}