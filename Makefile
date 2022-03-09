release-patch:
	@$(call release,patch)

release-minor:
	@$(call release,minor)

release-major:
	@$(call release,major)

define release
	npm run build
	npm version $(1) -m 'release v%s'
	git push --tags origin HEAD:main
	npm publish --access public
endef
