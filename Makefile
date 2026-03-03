.PHONY: all build build-mv2 build-mv3 safari install deploy clean help

EXTENSION_NAME := control-panel-for-twitter
EXTENSIONS_DIR := /Volumes/Shared/boot/extensions
TARGET_DIR := $(EXTENSIONS_DIR)/$(EXTENSION_NAME)
SAFARI_PROJECT := safari/Control Panel for Twitter.xcodeproj
SAFARI_SCHEME := Control Panel for Twitter (macOS)
SAFARI_BUILD_DIR := safari/build

help: ## Show this help message
	@echo "Control Panel for Twitter - Build & Deploy"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

build: ## Build MV2 + MV3 zips
	@echo "Building MV2 + MV3..."
	@npm run build

build-mv2: ## Build Manifest V2 only
	@npm run build-mv2

build-mv3: ## Build Manifest V3 only
	@npm run build-mv3

safari: ## Build Safari extension (self-healing Xcode)
	@echo "Building Safari extension..."
	@xcodebuild -project '$(SAFARI_PROJECT)' \
		-scheme '$(SAFARI_SCHEME)' \
		-configuration Release \
		-derivedDataPath $(SAFARI_BUILD_DIR) \
		CODE_SIGN_IDENTITY="-" \
		CODE_SIGNING_REQUIRED=NO \
		CODE_SIGNING_ALLOWED=NO \
		build 2>&1 | tee safari/build.log | tail -3; \
	if grep -q 'BUILD SUCCEEDED' safari/build.log; then \
		echo "Safari build OK: $(SAFARI_BUILD_DIR)/Build/Products/Release/Control Panel for Twitter.app"; \
	elif grep -q 'runFirstLaunch' safari/build.log; then \
		echo "Xcode needs first-launch setup. Running automatically..."; \
		xcodebuild -runFirstLaunch 2>&1; \
		echo "Retrying Safari build..."; \
		xcodebuild -project '$(SAFARI_PROJECT)' \
			-scheme '$(SAFARI_SCHEME)' \
			-configuration Release \
			-derivedDataPath $(SAFARI_BUILD_DIR) \
			CODE_SIGN_IDENTITY="-" \
			CODE_SIGNING_REQUIRED=NO \
			CODE_SIGNING_ALLOWED=NO \
			build 2>&1 | tee safari/build.log | tail -3; \
		grep -q 'BUILD SUCCEEDED' safari/build.log || { echo "Safari build failed. See safari/build.log"; exit 1; }; \
		echo "Safari build OK (after first-launch fix)"; \
	else \
		echo "Safari build failed. See safari/build.log"; \
		exit 1; \
	fi

safari-open: ## Open Safari extension app
	@open '$(SAFARI_BUILD_DIR)/Build/Products/Release/Control Panel for Twitter.app'

install: build deploy ## Build and deploy the extension

deploy: ## Deploy to $(TARGET_DIR)
	@echo "Deploying extension..."
	@./deploy.sh > /dev/null

clean: ## Clean build artifacts
	@rm -rf web-ext-artifacts unpacked manifest.json browser_action.html $(SAFARI_BUILD_DIR)
	@echo "Clean complete"

all: clean build safari deploy ## Clean, build all (incl Safari), and deploy
	@echo "All done"
